
(function($){
  'use strict';

  typeeditorapp.models.BaseType = Backbone.Model.extend({
    defaults: {
      order: null,
      tag: 'div',
      col_xs: null,
      col_sm: null,
      col_md: null,
      col_lg: null,
      classes: null
    },
    
    get_combined: function(keys){
      var that = this;
      var classes = _.map(keys, function(key) { 
        return that.get(key);
      });
      return _.compact(classes).join(' ');
      
    },

    get_classes: function() {
      return this.get_combined([
        'col_xs', 'col_sm', 'col_md', 'col_lg',
        'classes']);
    }
    
  });
  
  typeeditorapp.models.BaseType.prototype.sync = function() { return null; };
  typeeditorapp.models.BaseType.prototype.fetch = function() { return null; };
  typeeditorapp.models.BaseType.prototype.save = function() { return null; }  
  
  typeeditorapp.models.InputBaseType = typeeditorapp.models.BaseType.extend({
    defaults: _.extend({}, typeeditorapp.models.BaseType.prototype.defaults, {
      name: 'name',
      size: null,
      add_on_before: null,
      add_on_after: null
    }),
    
    initialize: function(){

    },
    get_classes: function() {
      return this.get_combined([
        'size',
        'col_xs', 'col_sm', 'col_md', 'col_lg',
        'classes']);
    }
  });  
  typeeditorapp.models.InputType = typeeditorapp.models.InputBaseType.extend({

    defaults: _.extend({}, typeeditorapp.models.InputBaseType.prototype.defaults, {
      tag: 'input',
      type: 'text',
      placeholder: null,
      checked: false,
      choices: null
    })
   
  });  
  typeeditorapp.collections.InputTypeCollection = Backbone.Collection.extend({
    model: typeeditorapp.models.InputType,
    
		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: 'order'
  });
  
  typeeditorapp.inputs = new typeeditorapp.collections.InputTypeCollection();
  
  typeeditorapp.models.FormControlType = typeeditorapp.models.BaseType.extend({
    defaults: {
      label: 'Label',
      input: null
    },

    initialize: function(){

    }
  });
  typeeditorapp.collections.FormControlCollection = Backbone.Collection.extend({

  });
  typeeditorapp.models.FormType = typeeditorapp.models.BaseType.extend({
    defaults: {
    },
    
    initialize: function(){

    }
  });
  typeeditorapp.views.InputView = Backbone.View.extend({
    template : _.template(templates.typeeditor_input_template||''),
    events : {
    },
    initialize : function(){
    },
    
    render : function(){
      this.el = this.template({model: this.model});
      return this;
    }
  });      

  typeeditorapp.views.InputEditView = Backbone.View.extend({
    template : _.template(templates.typeeditor_input_edit_template||''),
    events : {
    },


    initialize : function(){
    },
    
    render : function(){
      this.el = this.template();
      return this;
    }
  });
  
  typeeditorapp.views.FormControlView = Backbone.View.extend({
    template : _.template(templates.typeeditor_formcontrol_template||''),
    events : {
    },
    initialize : function(){
     this.render();
    },
    
    render : function(){
      this.el = this.template();
      return this;
    }
  });      

  typeeditorapp.views.FormControlEditView = Backbone.View.extend({
    template : _.template(templates.typeeditor_formcontrol_edit_template||''),
    events : {
    },
    initialize : function(){
      this.render();
    },
    
    render : function(){
      this.el = this.template();
      return this;
    }
  });
  
  typeeditorapp.views.FormView = Backbone.View.extend({
    template : _.template(templates.typeeditor_form_template||''),
    events : {
    },
    
    render : function(){
      this.el = this.template();
      return this;
    }
  });      

  typeeditorapp.views.FormEditView = Backbone.View.extend({
    template : _.template(templates.typeeditor_form_edit_template||''),
    events : {
    },
    
    render : function(){
      this.el = this.template();
      return this;
    }
  });
  
  typeeditorapp.views.TypeEditorView = Backbone.View.extend({
    el : $('.backbone'),
    template : _.template(templates.typeeditor_main_template),
    events : {
      'click .nav li a': 'activateTab'
    },
    initialize : function(){
       this.render();
			 this.$formcontrols = $('#formcontrols');
       this.listenTo(typeeditorapp.inputs, 'add', this.addOne);
    },
    
		addOne: function (input) {
			var view = new typeeditorapp.views.InputView({ model: input });
			this.$formcontrols.append(view.render().el);
		},

    render : function(){
      this.$el.html(this.template({}));
      return this;
    },
    activateTab : function(event){
      $(event.currentTarget).tab('show');
    }
  });
  
  var TypeEditor = new typeeditorapp.views.TypeEditorView();
  typeeditorapp.inputs.create({
    tag: 'input',
    type: 'text',
    col_md: 'col-md-12'
  })
      
})(jQuery);