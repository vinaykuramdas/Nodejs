var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.send('Vinay is on fire');
});

router.post('/',function(req,res){
    res.send('post route on things');
});

module.exports = router;

