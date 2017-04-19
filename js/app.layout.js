var myLayout = new GoldenLayout({
    settings: { showCloseIcon: false, showPopoutIcon: false },
    content: [{ type: 'component', componentName: 'fileTreeCont', title: 'files', isClosable: false, width: 12 }]
});
var ui = {
    fileTreeCont: null,
    fileTree: null,
};
function addComponent(name, generatorCallback) {
    var editor;
    myLayout.registerComponent(name, function (container, componentState) {
        //console.log('addComponent id', name, container.getElement());
        container.getElement().attr('id', name);
        if (generatorCallback) {
            container.on('resize', () => { if (editor && editor.resize)
                editor.resize(); });
            container.on('open', () => { ui[name] = editor = generatorCallback(container) || container; });
        }
        else
            ui[name + 'Cont'] = container;
    });
}
addComponent('fileTreeCont', cont => cont.getElement().append($("#fileTreeCont").children()));
myLayout.init();
//# sourceMappingURL=app.layout.js.map