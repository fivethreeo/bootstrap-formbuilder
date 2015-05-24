/*global Backbone, $ */
var app = app || {views:{}};
(function($){
  'use strict';
  app.views.TypeView = Backbone.View.extend({
    el : $('.backbone'),
    template : _.template('<p><%= text %></p>'),
    className : 'typeview',
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      this.$el.html(this.template({text:'hello'}));
      return this;
    }
  });
  
  var type = new app.views.TypeView();
})($);