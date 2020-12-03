var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var sql = require('mssql');
var config = {
		user: 'Test',
    password: 'Test@123',
    server: 'mssql-16028-0.cloudclusters.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'IIHF_CReturns',
    port: 16028
	};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

app.get('/', function(req, res){
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.query('SELECT * FROM dbo.RET_Customer', function(err, result){
			if(err) console.log(err)
				res.send(result.recordset[0]);
		})
	})
});

app.post('/log',function(req, res){
	var username = req.body.UserName;
	var password = req.body.password;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, username)
		request.input('input_parameters1', sql.NVarChar, password)
		request.query(`SELECT * FROM dbo.RET_Login where Name = @input_parameters and Password = @input_parameters1`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/cust',function(req, res){
	var custcode = req.body.code;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, custcode)
		request.query(`SELECT * FROM dbo.RET_Customer where CustomerCode = @input_parameters`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/prod',function(req, res){
	var custcode = req.body.code;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, custcode)
		request.query(`SELECT * FROM dbo.RET_StockItem where StockCode = @input_parameters`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/Invo',function(req, res){
	var custcode = req.body.code;
	var procode = req.body.procode;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, custcode)
		request.input('input_parameters1', sql.NVarChar, procode)
		request.query(`select InvoiceRef,InvoiceDate from ret_CustomerInvoices where Customercode = @input_parameters and Productcode = @input_parameters1 order by convert(date, InvoiceDate) DESC`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});


app.post('/Rreason',function(req, res){
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.query(`SELECT * FROM dbo.RET_Reasons`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/RDest',function(req, res){
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.query(`SELECT * FROM dbo.RET_Destination`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/RHeader',function(req, res){
	var custcode = req.body.code;
	var date = req.body.date;
	var LoginID = req.body.LoginID;
	var status = 1;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, custcode)
		request.input('input_parameters1', sql.DateTime, date)
		request.input('input_parameters2', sql.NVarChar, LoginID)
		request.input('input_parameters3', sql.Int, status)
		request.output('ouput_parameter', sql.Int)
		request.query(`INSERT INTO dbo.RET_ReturnsHeader (CustomerID , DateTime, Status, LoginID) OUTPUT Inserted.ID VALUES ( @input_parameters, @input_parameters1, @input_parameters3, @input_parameters2 )`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/Image',function(req, res){
	var Image = req.body.Image;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Image, new Buffer(Image))
		request.output('ouput_parameter', sql.Int)
		request.query(`INSERT INTO dbo.RET_Image (Picture) OUTPUT Inserted.ID VALUES ( @input_parameters )`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/REPost',function(req, res){
	var rheader = req.body.rheader;
	var stockid = req.body.stockid;
	var reasonid = req.body.reasonid;
	var invoiceref = req.body.InvoiceRef;
	var ImageID = req.body.Image;
	var BBD = req.body.BBD;
	var Destination = req.body.Destination;
	var Note = req.body.Note;
	var Act = 'N';
	if(BBD == 'null'){
		console.log(null);
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Int, rheader)
		request.input('input_parameters1', sql.Int, stockid)
		request.input('input_parameters2', sql.Int, reasonid)
		request.input('input_parameters3', sql.NVarChar, invoiceref)
		request.input('input_parameters4', sql.Int, ImageID)
		request.input('input_parameters6', sql.Int, Destination)
		request.input('input_parameters7', sql.NVarChar, Note)
		request.input('input_parameters8', sql.NVarChar, Act)
		request.query(`INSERT INTO dbo.RET_ReturnDetail (ReturnsHeaderID , StockItemID, ReasonID, InvoiceRef, ImageID, DestinationID, Note, Act) VALUES ( @input_parameters, @input_parameters1, @input_parameters2, @input_parameters3, @input_parameters4, @input_parameters6, @input_parameters7, @input_parameters8 )`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
	}else{
		sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Int, rheader)
		request.input('input_parameters1', sql.Int, stockid)
		request.input('input_parameters2', sql.Int, reasonid)
		request.input('input_parameters3', sql.NVarChar, invoiceref)
		request.input('input_parameters4', sql.Int, ImageID)
		request.input('input_parameters5', sql.DateTime, BBD)
		request.input('input_parameters6', sql.Int, Destination)
		request.input('input_parameters7', sql.NVarChar, Note)
		request.input('input_parameters8', sql.NVarChar, Act)
		request.query(`INSERT INTO dbo.RET_ReturnDetail (ReturnsHeaderID , StockItemID, ReasonID, InvoiceRef, ImageID, BBD, DestinationID, Note, Act) VALUES ( @input_parameters, @input_parameters1, @input_parameters2, @input_parameters3, @input_parameters4, @input_parameters5, @input_parameters6, @input_parameters7, @input_parameters8 )`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
	}
});

app.post('/AuthReturns',function(req, res){
	var LoginID = req.body.LoginID;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.NVarChar, LoginID)
		request.query(`Select P.ID, P.CustomerID, P.CustomerName, P.DateTime, Status_Desc from dbo.RET_ReturnStatus INNER JOIN (Select dbo.RET_ReturnsHeader.ID, dbo.RET_ReturnsHeader.CustomerID, dbo.RET_Customer.CustomerName, dbo.RET_ReturnsHeader.DateTime, dbo.RET_ReturnsHeader.Status From dbo.RET_ReturnsHeader INNER JOIN dbo.RET_Customer ON dbo.RET_ReturnsHeader.CustomerID = dbo.RET_Customer.ID where LoginID = @input_parameters and status != 4) P ON dbo.RET_ReturnStatus.ID = P.Status`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/AuthReturnsD',function(req, res){
	var RHID = req.body.RHID;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Int, RHID)
		request.query(`Select P.ID, S.StockCode, S.Description, S.Brand, S.Issueunit, P.InvoiceRef, Q.InvoiceDate, P.BBD, P.ImageID, P.Note, P.Qty, R.Description From (select * from dbo.RET_ReturnDetail where ReturnsHeaderID = @input_parameters) P INNER JOIN dbo.RET_StockItem S ON P.StockItemID = S.ID INNER JOIN dbo.RET_Reasons R ON P.ReasonID = R.ID INNER JOIN dbo.RET_CustomerInvoices Q ON P.InvoiceRef = Q.InvoiceRef and S.StockCode = Q.Productcode;`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/PostImage',function(req, res){
	var Img = req.body.Image;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Int, Img)
		request.query(`Select * From dbo.RET_Image where ID = @input_parameters;`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});

app.post('/lines',function(req, res){
	var RHID = req.body.id;
	sql.connect(config, function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		request.input('input_parameters', sql.Int, RHID)
		request.query(`Select count(ID) Counts from dbo.RET_ReturnDetail where ReturnsHeaderID = @input_parameters`, function(err, result){
			if(err) console.log(err)
				res.end(JSON.stringify(result));
		})
	})
});


var server = app.listen(3000, function(){
	console.log("server is running");
})