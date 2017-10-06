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

  var HomepageView = TemplateView.extend({
    templateName: '#home-template'
  });

  var LoginView = TemplateView.extend({
    id: 'login',
    templateName: '#login-template',
    events: {
      'submit form': 'submit'
    },
    submit: function (event) {
      var data = {};
      event.preventDefault();
      this.form = $(event.currentTarget);
      data={
        username: $(':input[name="username"]', this.form).val(),
        password: $(':input[name="password"]', this.form).val()
      };
      // TODO: Submit the login form
    }
  });

  app.views.HomepageView = HomepageView;
  app.views.LoginView = LoginView;
})(jQuery, Backbone, _, app);
