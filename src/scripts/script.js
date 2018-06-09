import 'easy-pie-chart/dist/jquery.easypiechart';
import * as _ from 'lodash';
import { parse, differenceInMonths } from 'date-fns';
const scrollTo = require('jquery.scrollto');

const $ = require('jquery');
const jsrender = require('jsrender')($);
const aboutTemplateFile = require('../templates/about.template.html');
const skillTemplateFile = require('../templates/skills.template.html');
const educationTempalteFile = require('../templates/education.template.html');
const experienceTemplateFile = require('../templates/experience.template.html');

$(function() {
  /**** MENU ****/
  $('.menu a').on('click', function(e) {
    e.preventDefault();
    //change active li menu
    $('.menu a').removeClass('active');
    $(this).addClass('active');

    //scroll on click
    // $("html,body").animate({
    //     scrollTop: $("#" + $(this).data("value")).offset().top - 20
    // }, 1500);
  });

  //open and close menu
  $('.menu .open-menu').on('click', function() {
    if ($('.menu').css('left') == '-160px') {
      $('.menu').css('left', '0px');
      $('.menu .open-menu i').attr('class', 'fa fa-times');
    } else if ($('.menu').css('left') == '0px') {
      $('.menu').css('left', '-160px');
      $('.menu .open-menu i').attr('class', 'fa fa-bars');
    }
  });

  // call API
  const resumeUrl = './assets/mock-resume.json';

  $('.scroll-top').click(function(e) {
    e.preventDefault();
    $(window).scrollTo(
      0,
      {},
      {
        duration: 2000,
        easing: 'swing',
      },
    );
  });

  $('.menu-content > ul > li > a').click(function(e) {
    e.preventDefault();
    const id = '#' + $(this).data('value');
    $(window).scrollTo(
      $(id),
      {
        offset: {
          top: -60,
        },
      },
      {
        duration: 2000,
        easing: 'swing',
      },
    );
  });

  $.getJSON(resumeUrl, data => {
    setInterval(() => {
      clearInterval(loadingInterval); // declared in index.html
      $('#loader').css('display', 'none');
      $('.content').css('display', 'block');
    }, 3000);

    /**** WOW-ANIMATE ****/
    new WOW().init();

    let resume = data.resume[0];
    console.log(resume);

    // Calculate experience
    const expMonth = differenceInMonths(
      new Date(),
      parse(resume.experienceStart),
    );
    let experince = {
      year: Math.floor(expMonth / 12),
      month: expMonth % 12,
    };

    // Set Display Image
    $('#display-image').attr('src', resume.displayImage);
    // Set Resume Link
    $('.download-resume')
      .parent()
      .attr('href', resume.resumeLink);

    const profileInfo = _.pick(
      resume,
      'name',
      'title',
      'aboutMe',
      'certifications',
      'socialLinks',
    );
    profileInfo.summary = _.pick(resume, 'email', 'phone');

    console.log(profileInfo);

    $('#profile-info').html(jsrender.templates(aboutTemplateFile)(profileInfo));

    const skills = _.pick(resume, 'technologies', 'frameworks');
    console.log(skills);
    $('#skills').html(jsrender.templates(skillTemplateFile)(skills));

    $('.chart').easyPieChart({
      barColor: '#2c2d5a',
      trackColor: '#757575',
      scaleColor: false,
      lineWidth: '10',
      lineCap: 'square',
    });

    const education = _.pick(resume, 'education');
    console.log(education);
    $('#education').html(jsrender.templates(educationTempalteFile)(education));

    const experience = _.pick(resume, 'experience');
    console.log(experience);
    $('#experience').html(jsrender.templates(experienceTemplateFile)(experience));
    
  });
});
