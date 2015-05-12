var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/omega');

var Applicant = mongoose.model('applicant', {
    name: String,
    bio: String,
    skills: [String],
    years: Number,
    why: String
});

app.get('/', function(req, res) {
	res.render('index');
});

// displays a list of applicants
app.get('/applicants', function (req, res){
    Applicant.find({}, function (err, results) {
        res.render('applicants', {
            applicants: results
        });
    });
});

// creates an applicant
app.post('/applicant', function(req, res){
	// Here is where you need to get the data
	// from the post body and store it in the database

    var skills = req.body.skills.split(',').map(function(skill) {
        return skill.trim();
    });

	var applier = new Applicant ({
        name: req.body.name,
        bio: req.body.bio,
        skills: skills,
        years: req.body.years,
        why: req.body.why
    });

    applier.save(function (err, results) {
        res.redirect('/');
    });
});

// delete and applicant
app.get('/delete/:applicantId', function (req, res) {
    Applicant.findByIdAndRemove(req.params.applicantId, function (err, results) {
        res.redirect('/applicants');
    });
});

// view applicant by id
app.get('/applicant/:applicantId', function (req, res) {
    Applicant.findById(req.params.applicantId, function (err, results) {
        res.render('applicant', {
            applicant: results
        });
    });
});

var server = app.listen(8441, function() {
	console.log('Express server listening on port ' + server.address().port);
});
