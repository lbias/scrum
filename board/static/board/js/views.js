(function ($, Backbone, _, app) {

  var TemplateView = Backbone.View.extend({
    templateName: '',
    initialize: function () {
      this.template = _.template($(this.templateName).html());
    },
    render: function () {
      var context = this.getContext(),
        html = this.template(context);
      this.$el.html(html);
    },
    getContext: function () {
      return {};
    }
  });

  var FormView = TemplateView.extend({
      events: {
          'submit form': 'submit'
      },
      errorTemplate: _.template('<span class="error"><%- msg %></span>'),
      clearErrors: function () {
          $('.error', this.form).remove();
      },
      showErrors: function (errors) {
          _.map(errors, function (fieldErrors, name) {
              var field = $(':input[name=' + name + ']', this.form),
                  label = $('label[for=' + field.attr('id') + ']', this.form);
              if (label.length === 0) {
                  label = $('label', this.form).first();
              }
              function appendError(msg) {
                  label.before(this.errorTemplate({msg: msg}));
              }
              _.map(fieldErrors, appendError, this);
          }, this);
      },
      serializeForm: function (form) {
          return _.object(_.map(form.serializeArray(), function (item) {
              // Convert object to tuple of (name, value)
              return [item.name, item.value];
          }));
      },
      submit: function (event) {
          event.preventDefault();
          this.form = $(event.currentTarget);
          this.clearErrors();
      },
      failure: function (xhr, status, error) {
          var errors = xhr.responseJSON;
          this.showErrors(errors);
      },
      done: function (event) {
          if (event) {
              event.preventDefault();
          }
          this.trigger('done');
          this.remove();
      }
  });

  var HomepageView = TemplateView.extend({
    templateName: '#home-template'
  });

  var LoginView = TemplateView.extend({
    id: 'login',
    templateName: '#login-template',
    errorTemplate: _.template('<span class="error"><%- msg %></span>'),
    events: {
      'submit form': 'submit'
    },
    submit: function (event) {
      var data = {};
      event.preventDefault();
      this.form = $(event.currentTarget);
      this.clearErrors();
      data={
        username: $(':input[name="username"]', this.form).val(),
        password: $(':input[name="password"]', this.form).val()
      };
      $.post(app.apiLogin, data)
        .success($.proxy(this.loginSuccess, this))
        .fail($.proxy(this.loginFailure, this));
    },
    loginSuccess: function (data) {
      app.session.save(data.token);
      this.trigger('login', data.token);
    },
    loginFailure: function (xhr, status, error) {
      var errors = xhr.responseJSON;
      this.showErrors(errors);
    },
    showErrors: function (errors) {
      _.map(errors, function (fieldErrors, name) {
        var field = $(':input[name=' + name + ']', this.form),
          label = $('label[for=' + field.attr('id') + ']', this.form);
        if (label.length === 0) {
          label = $('label', this.form).first();
        }
        function appendError(msg) {
          label.before(this.errorTemplate({msg: msg}));
        }
        _.map(fieldErrors, appendError, this);
      }, this);
    },
    clearErrors: function () {
      $('.error', this.form).remove();
    }
  });

  app.views.HomepageView = HomepageView;
  app.views.LoginView = LoginView;
})(jQuery, Backbone, _, app);
