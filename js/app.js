/// <reference path="../lib/ts-types/goldenlayout.d.ts" />
// /// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
var baseUrl = location.href.split('?')[0].split('/').slice(0, -1).join('/') + '/';
$.jstree.defaults.core.force_text = true;
var itree;
localStorage.setItem('lastVersion', kaitaiIde.version);
$(() => {
    $('#webIdeVersion').text(kaitaiIde.version);
    $('#welcomeModal').modal();
    $('#aboutWebIde').on('click', () => $('#welcomeModal').modal());
});
//# sourceMappingURL=app.js.map