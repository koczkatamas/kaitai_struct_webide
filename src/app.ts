/// <reference path="../lib/ts-types/goldenlayout.d.ts" />
// /// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

declare var YAML: any, io: any, jailed: any, IntervalTree: any, localforage: LocalForage, bigInt: any, kaitaiIde: any;

var baseUrl = location.href.split('?')[0].split('/').slice(0, -1).join('/') + '/';

$.jstree.defaults.core.force_text = true;

var itree;

localStorage.setItem('lastVersion', kaitaiIde.version);

$(() => {
    $('#webIdeVersion').text(kaitaiIde.version);

    (<any>$('#welcomeModal')).modal();
    $('#aboutWebIde').on('click', () => (<any>$('#welcomeModal')).modal());
});