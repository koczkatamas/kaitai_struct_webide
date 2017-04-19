function downloadFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    return new Promise<ArrayBuffer>((resolve, reject) => {
        xhr.onload = function (e) {
            resolve((<any>this).response);
        };

        xhr.send();
    });
}

function saveFile(data: ArrayBuffer | Uint8Array, filename: string) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    (<any>a).style = "display:none";
    var blob = new Blob([data], { type: "octet/stream" });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

class Delayed {
    private timeout: number;

    constructor(public delay: number) { }

    public do(func) {
        if (this.timeout)
            clearTimeout(this.timeout);

        this.timeout = setTimeout(function () {
            this.timeout = null;
            func();
        }, this.delay);
    }
}

interface String {
    repeat(count: number): string;
    endsWith(searchString: string, position: number): boolean;
    ucFirst(): string;
}

String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count !== count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count === Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length === 0 || count === 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (; ;) {
            if ((count & 1) === 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count === 0) {
                break;
            }
            str += str;
        }
        // Could we try:
        // return Array(count + 1).join(this);
        return rpt;
    }
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

interface Array<T> { last(): T; }

if (!Array.prototype.last) {
    Array.prototype.last = function () { return this[this.length - 1]; };
}

function asciiEncode(bytes) {
    var len = bytes.byteLength;
    var binary = '';
    for (var i = 0; i < len; i++)
        binary += String.fromCharCode(bytes[i]);
    return binary;
}

function hexEncode(bytes) {
    var len = bytes.byteLength;
    var binary = '0x';
    for (var i = 0; i < len; i++)
        binary += bytes[i].toString(16);
    return binary;
}

function arrayBufferToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var binary = asciiEncode(bytes);
    return window.btoa(binary);
}

function readBlob(blob, mode: "arrayBuffer" | "text" | "dataUrl", ...args) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = function (e) { reject(e); };
        reader['readAs' + mode[0].toUpperCase() + mode.substr(1)](blob, ...args);
    });
}

function htmlescape(s) {
    return $("<div/>").text(s).html();
}

interface IFileReader {
    (mode: "arrayBuffer"): Promise<ArrayBuffer>;
    (mode: "text"): Promise<string>;
    (mode: "dataUrl"): Promise<string>;
};

interface IFileProcessItem {
    file: File;
    read: IFileReader;
}

interface IFileProcessCallback {
    (files: IFileProcessItem[]);
};

function processFiles(files) {
    var resFiles = <IFileProcessItem[]>[];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        resFiles.push({ file: file, read: function (mode) { return readBlob(this.file, mode); } })
    }
    return resFiles;
}

function openFilesWithDialog(callback: IFileProcessCallback) {
    $('<input type="file" multiple />').on('change', e => {
        var files = processFiles((<any>e.target).files);
        callback(files);
    }).click();
}

function getAllNodes(tree) {
    function collectNodes(node, result) {
        result.push(node);
        node.children.forEach(child => collectNodes(child, result));
    }

    var allNodes = [];
    var json = tree.get_json().forEach(item => collectNodes(item, allNodes));
    return allNodes;
}

interface Date {
    format(format: string): string;
}

function s(strings, ...values) {
    var result = strings[0];
    for (var i = 1; i < strings.length; i++)
        result += htmlescape(values[i - 1]) + strings[i];
    return result;
}