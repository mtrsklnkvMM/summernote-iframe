(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    $.extend(true, $.summernote.lang, {
        'en-US': {
            iframe: {
                iframe: 'Iframe',
                editBtn: 'Insert'
            }
        }
    });

    // Extends plugins for print plugin.
    $.extend($.summernote.plugins, {
        'iframe': function (context) {
            var self = this;

            var ui = $.summernote.ui;
            var $editor = context.layoutInfo.editor;
            var options = context.options;
            var lang = options.langInfo;
            var $note = context.layoutInfo.note;

            this.initialize = function () {
                var $container = options.dialogsInBody ? $(document.body) : $editor;
                var body = '<div id="note-iframe">' +
                    '<div class="form-horizontal">'+
                    '<div class="form-group">' +
                    '<label class="control-label col-md-3" for="link">Location (address)</label>' +
                    '<div class="col-md-9">' +
                    '<input class= "text-modal text-box single-line" name="link" type="text" value="" id="AddIFrame">' +
                    '</div></div>' +
                    '<div class="form-group">' +
                    '<label class="control-label col-md-3" for="txtWidth">Width</label>' +
                    '<div class="col-md-9">' +
                    '<input class= "text-modal text-box single-line" name="txtWidth" type="text" value="900" size="50" id="AddIFrame_txtWidth" class="NormalTextBox">' +
                    '</div></div>' +
                    '<div class="form-group">' +
                    '<label class="control-label col-md-3" for="txtHeight">Height</label>' +
                    '<div class="col-md-9">' +
                    '<input class= "text-modal text-box single-line" name="txtHeight" type="text" value="170" size="50" id="AddIFrame_txtHeight" class="NormalTextBox">' +
                    '</div></div></div></div>';
                   
                this.$dialog = ui.dialog({
                    title: lang.iframe.iframe,
                    body: body,
                    footer: '<button href="#" class="btn btn-primary note-iframe-btn">' + lang.iframe.editBtn + '</button>'
                }).render().appendTo($container);
            };
            this.show = function () {
                this.showIFrameDialog();
            };
            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };
            this.showIFrameDialog = function () {
                return $.Deferred(function (deferred) {
                    var $iframeBtn = self.$dialog.find('.note-iframe-btn');

                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');

                        $iframeBtn.click(function (event) {
                            event.preventDefault();
                            var link = $('#AddIFrame').val();
                            var w = $('#AddIFrame_txtWidth').val();
                            var h = $('#AddIFrame_txtHeight').val();
                            var iframeData = '<iframe id="IFrame_htmIFrame" src="'+ link +'" scrolling="auto" width="'+w+'" frameborder="0" allowindex="True" height="'+h+'" hideadminborder="False"></iframe>'
                            $note.summernote('code', iframeData);
                            ui.hideDialog(self.$dialog);
                        });
                    });

                    ui.onDialogHidden(self.$dialog, function () {
                        $iframeBtn.off('click');
                        self.destroy();
                        if (deferred.state() === 'pending') {
                            deferred.reject();
                        }
                    });

                    ui.showDialog(self.$dialog);
                });
            }
           
            context.memo('button.iframe', function () {
     
                var button = ui.button({
                    contents: '<i class="fa fa-info"/>',
                    tooltip: lang.iframe.iframe,
                    click: function () {
                        context.invoke('iframe.show');
                    }
                });
                // create jQuery object from button instance.
                var $iframe = button.render();
                return $iframe;
            });
        }
    });
}));
