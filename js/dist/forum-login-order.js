(function () {
  function defaultExport(module) {
    return module && module.__EsModule ? module.default : module;
  }

  var app = defaultExport(flarum.reg.get('core', 'forum/app'));
  var extension = flarum.reg.get('core', 'common/extend');
  var LogInButtons = defaultExport(flarum.reg.get('core', 'forum/components/LogInButtons'));
  var LogInButton = defaultExport(flarum.reg.get('core', 'forum/components/LogInButton'));

  app.initializers.add('fof/oauth-login-order', function () {
    extension.extend(LogInButton, 'initAttrs', function (_, attrs) {
      if (attrs.className && attrs.className.indexOf('FoFLogInButton') !== -1 && attrs.className.indexOf('Button--block') === -1) {
        attrs.className = attrs.className.replace('Button ', 'Button Button--block ');
      }
    });

    extension.override('flarum/forum/components/LogInModal', 'body', function () {
      return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), m(LogInButtons)];
    });

    extension.override('flarum/forum/components/SignUpModal', 'body', function () {
      return [m('div', { className: 'Form Form--centered' }, this.fields().toArray()), !this.attrs.token && m(LogInButtons)];
    });
  });
})();
