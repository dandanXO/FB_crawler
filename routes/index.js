var express = require('express');
var FB = require('fb');
var fb = new FB.Facebook();
var router = express.Router();

// FB setting
FB.options({version: 'v2.12'});
var FbApp = FB.extend({appId: '139127040243273', appSecret: 'c92ec11b3a45d49ea8b5cece447ac8d5'})
FbApp.setAccessToken('EAABZBiQnP9kkBAP8anBo4Vb0ZA3H74vi8cgCWQU2h3kaAYvHBw1K8uPkQNGDkcP1cwua4fuGssm0t7WqkOlMzWIWCoXkh65baNorWW7IxS4FFFwMZAxhQ4CzsrZCWIW0YTDGubbydb0GsAIZCAreOXFZCUQdJCu3gwH6FkQBBtlIxP0qN4utMe')

/* GET home page. */
let Since="";
let Until="";
router.get('/', function(req, res, next) {


  res.render('index', { title: 'FACEBOOK clwaer ' });
});
router.get('/next/:pagename', function(req, ress, next) {
  var pagename = req.query.pagenameSD;
  var jadge = true;
  var nextPages = req.query.nextpage.replace("https://graph.facebook.com/v2.12/","");
  //console.log(nextPages)
  FbApp.api(nextPages, function (res) {
    if(!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     console.log("似乎沒有下一頁") 
     return;
    }
    var alldata = res.data;
   
    alldata.forEach(function(elm){
     if(elm.shares == undefined){
       let shares = {count:0}
       elm['shares'] = shares;
     }
    })
    if(res.paging.next == undefined){
      jadge = false
    }
    ress.render('page',{pagename:pagename,alldata:alldata,res:res,jadge:jadge})
  });
  
});

router.get('/s/:pageName',function(req,ress,next){
  var jadge = true;
  var data ;
  var currentTime=Until
  //console.log(Since)
  var sinceTime=Since;
  var pagename = req.params.pageName;
  FbApp.api(pagename+'/posts',{ since: sinceTime,until:currentTime,fields: 'shares,reactions.limit(0).summary(true),likes.limit(0).summary(true),message{begin_date},comments.limit(1).summary(true)' }, function (res) {
    if(!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     return;
    }
   // console.log(res.data);
   var alldata = res.data;
   
   alldata.forEach(function(elm){
    if(elm.shares == undefined){
      let shares = {count:0}
      elm['shares'] = shares;
    }
   })
    if(res.paging.next == undefined){
      jadge = false
    }
    ress.render('page',{pagename:pagename,alldata:alldata,res:res,jadge:jadge})
  });

})
router.get('/seven/:pageName',function(req,ress,next){
  //res.render('page',{pageName:req.params.pageName})
  var data ;
  var currentTime=Math.floor(new Date() / 1000)
  var sevenDaysago = Math.floor(new Date() / 1000) - 604800
  var pagename = req.params.pageName;
  FbApp.api(pagename+'/posts',{ since: sevenDaysago,until:currentTime,fields: 'shares,reactions.limit(0).summary(true),likes.limit(0).summary(true),message{begin_date},comments.limit(1).summary(true)' }, function (res) {
    if(!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     return;
    }
   // console.log(res.data);
   var alldata = res.data;
   
   alldata.forEach(function(elm){
    if(elm.shares == undefined){
      let shares = {count:0}
      elm['shares'] = shares;
      console.log(elm)
    }
   })
    ress.render('page',{pagename:pagename,alldata:alldata,seven:'前7天內的發文'})
  });

})

router.get('/searchpage',function(req,ress,next){
  var pagename = req.query.pageName;
   ress.redirect('/s/'+pagename)
})
router.get('/searchDateRange',function(req,ress,next){
  var pagename = req.query.pagenameSD;
  Since = new Date(req.query.Since).getTime() / 1000;
  Until = new Date(req.query.Until).getTime() / 1000;
  ress.redirect('/s/'+pagename)
})
module.exports = router;
