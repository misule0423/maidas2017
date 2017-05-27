var express = require('express');
var mongoose = require('mongoose');
var assert = require('assert');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var Day = require('../models/day');

//파일 업로드 셋팅


//Save meal menu
exports.saveDay = function(req,res){

    var newDay = new Day();

    // 눌렀을 때 받아와야 함
    newDay.date = req.body.mealDate;

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
            console.log(process.cwd()+'/public/uploads/ask/' + req.files[name].name);
            console.log("NOT NULL");
            if(i==0){
                newDay.morning.imagePath = process.cwd()+'/public/uploads/ask/' + req.files[name].name;
            }else if(i == 1){
                newDay.lunch.imagePath = process.cwd()+'/public/uploads/ask/' + req.files[name].name;
            }else{
                newDay.dinner.imagePath =  process.cwd()+'/public/uploads/ask/' + req.files[name].name;
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


