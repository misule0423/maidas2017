var express = require('express');
var mongoose = require('mongoose');
var assert = require('assert');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var Day = require('../models/day');
var User = require('../models/user');

//파일 업로드 셋팅
exports.findDay = function(req,res){
    // var findDate = new Date(req.body.year,req.body.month,req.body.day);
    var day;
    var month;
    if(req.body.month.length  == 1){
       month = '0' + req.body.month;
    }else{
        month =  req.body.month;
    }
    if(req.body.day.length  == 1){
        day = '0' + req.body.day;
    }else{
        day = + req.body.day;
    }
    var mealDate = req.body.year + month + day;
    Day.findOne({'date': mealDate }, function (err, docs){

        if(err) return console.log("detail err");
        if(!docs){
            res.send("1");
            // return console.log("detail not find");

       }

        res.send(docs);
    });
};


//Save meal menu
//Save meal menu
exports.saveDay = function(req,res){

    var newDay = new Day();
    var tmpDate = req.body.mealDate;
    var dateArr =tmpDate.split('-');
    var year = dateArr[0];
    var month;
    var day;
    if(dateArr[1].length == 1){
         month = '0' + dateArr[1];
    }else{
        month = dateArr[1];
    }
    if(dateArr[2].length == 1){
        day = '0' + dateArr[2];
        console.log(day);
    }else{
        day=dateArr[2];
    }
    console.log(year + month + day);
    var mealDate = year + month + day;
    newDay.date = mealDate;

    // 눌렀을 때 받아와야 함
    newDay.morning.mainMenu1 = req.body.morningMenu1;
    newDay.morning.mainMenu2 = req.body.morningMenu2;
    newDay.morning.mainMenu3 = req.body.morningMenu3;
    newDay.morning.mainMenu4 = req.body.morningMenu4;
    newDay.morning.mainMenu5 = req.body.morningMenu5;
    newDay.morning.sideMenu = req.body.morningSideMenu;

    newDay.lunch.mainMenu1 = req.body.lunchMenu1;
    newDay.lunch.mainMenu2 = req.body.lunchMenu2;
    newDay.lunch.mainMenu3 = req.body.lunchMenu3;
    newDay.lunch.mainMenu4 = req.body.lunchMenu4;
    newDay.lunch.mainMenu5 = req.body.lunchMenu5;
    newDay.lunch.sizdeMenu = req.body.lunchSideMenu;

    newDay.dinner.mainMenu1 = req.body.dinnerMenu1;
    newDay.dinner.mainMenu2 = req.body.dinnerMenu2;
    newDay.dinner.mainMenu3 = req.body.dinnerMenu3;
    newDay.dinner.mainMenu4 = req.body.dinnerMenu4;
    newDay.dinner.mainMenu5 = req.body.dinnerMenu5;
    newDay.dinner.sideMenu = req.body.dinnerSideMenu;

    var name;
    // save image file

    for(var i = 0; i < 3; i++){
        if(i==0){
            name = 'morningImage';
        }else if(i == 1){
            name = 'lunchImage';
        }else{
            name = 'dinnerImage';
        }

        if(req.files[name]!=null){
            console.log(i);
            console.log("===========================================");
            var path = process.cwd()+'/public/uploads/ask/' + req.files[name].name;
            console.log(path);
            console.log("NOT NULL");
            if(i==0){
                newDay.morning.imagePath = '/uploads/ask/' + req.files[name].name;
            }else if(i == 1){
                newDay.lunch.imagePath = '/uploads/ask/' + req.files[name].name;
            }else{
                newDay.dinner.imagePath =  '/uploads/ask/' + req.files[name].name;
            }

            req.files[name].mv(process.cwd()+'/public/uploads/ask/'+req.files[name].name, function (err) {
                if (err) {
                    console.log("file not upload");
                    res.status(500).send(err);
                }
            });
        }
    }

    newDay.save(function (err, silence) {
        if (err) {
            console.log("DB error : " + err);
            return;
        }
        console.log("DB INSERT");
    });


    res.redirect('/main');
};

exports.saveIsMeal = function(req,res){
    
    // console.log("hihi");
    // console.log(req.body);
    // console.log(req.user);

    var id = mongoose.Types.ObjectId(req.user._id);
    // console.log(id);

    User.findOne({'_id': id}, function(err, user){

        if(err) return console.log("detail err");
        if(!user){
            return console.log("detail not find");
        }


        // console.log(user);
        // console.log(req.body.data);

        // console.log(user.is_meal.length);
        var flag = false;    

        for (var i = 0 ; i < user.is_meal.length; i++) {
            if(user.is_meal[i] == req.body.data){
                flag = true;
            }
        }

        if(flag == true){
            console.log("is_meal is already exist");
            res.send("1");

        } else {
            user.is_meal.push(req.body.data);
            user.save(function(err){
                if (err)
                    throw err;
            });

            res.send(req.body);
        }

        // user.is_meal.length
        // user.is_meal.push(req.body.data);

        // res.send(docs);

        // user.save(function(err){
        // if (err)
        //   throw err;
        // });

    });

    

};

exports.checkIsMeal = function(req,res){

    var id = mongoose.Types.ObjectId(req.user._id);
    // console.log(id);

    User.findOne({'_id': id}, function(err, user){
        if(err) return console.log("detail err");
        if(!user){
            return console.log("detail not find");
        }


        var result = [];

        // console.log(req.body.data);

        for (var i = 0 ; i < user.is_meal.length; i++) {
            
            // console.log(user.is_meal[i]);
            result.push(user.is_meal[i]);
            // if(user.is_meal[i] == req.body.data+'-01' || user.is_meal[i] == req.body.data+'-02' || user.is_meal[i] == req.body.data+'-03' ){
                // res.send(user.is_meal[i]);
                // console.log("hihi");
            // }
            
        }

        // console.log(result);

        res.send(result);
        
    });

};
