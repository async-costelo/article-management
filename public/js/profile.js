
$(document).ready(function () {

    var counter = 1;

    id_().then((res) => {

        $('[name="uid"]').val(res.id);

        // Load data into table via DataTables
        var dt = $('#articles').DataTable({

            'ajax': {
                "url": '/api/articles/' + res.id,
                "type": 'GET',
                "contentType": 'application/json',
                "dataSrc": function (res) {
                    var count = res.length;

                    $('#article-count').append(' (' + count + ')')

                    return res;

                }
            },
            'columns': [
                {
                    'render': function (data, type, full, meta) {
                        return counter++;
                    }
                },
                { "data": "title" },
                { "data": "description" },
                {
                    'render': function (data, type, full, meta) {
                        let date = moment(full.created_at).format('lll')
                        return date;
                    }
                },
                {
                    'render': function (data, type, full, meta) {

                        let uid = full.user_id;
                        let id = full.id;
                        let id_element = uid + '-' + id;

                        return '<button id="' + id_element + '" name="edit-article" class="btn btn-primary btn-sm edit-article">' + '<i class="fa fa-eye" style="color: white;"></i>' + '</button>';
                    }
                }
            ]

        });

        // Initialize functions
        load_tiny_mce();
        create_modal();
        table_row_click(dt);
    });



});

// Shows modal with existing data binded per Row
let show_modal = (obj) => {

    $('.modal-edit-title').html(obj.title);
    $('[name="description"]').val(obj.description);
    $('[name="title"]').val(obj.title);

    if (obj.thumbnailimg)
        $("#thumbimg").attr("src", ".." + obj.thumbnailimg);
    else
        $("#thumbimg").attr("src", "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%221136%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201136%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_174a224c78e%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A57pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_174a224c78e%22%3E%3Crect%20width%3D%221136%22%20height%3D%22250%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22403.8828125%22%20y%3D%22150.5%22%3E1136x250%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");

    tinymce.activeEditor.setContent(obj.message);

    $('#article-modal').modal('show');

}
// Shows modal for article creation
let create_modal = () => {

    $('#create-article').on('click', function () {
        $('#article-modal-new').modal('show');
    })

}
//
let table_row_click = (dt) => {

    $(document).on('click', '.edit-article', function () {

        var $btn = $(this);
        var $tr = $btn.closest('tr');
        var dataTableRow = dt.row($tr[0]);
        var rowData = dataTableRow.data();

        show_modal(rowData);
    });

}
//
var load_tiny_mce = () => {

    tinymce.init({
        selector: '#message',
        entity_encoding: "raw",
        height: "600"
    });

    tinymce.init({
        selector: '#newmessage',
        entity_encoding: "raw",
        height: "600"
    });

}
// Fetch user id via AJAX call req @param name
let fetch_id = () => {

    return $.ajax({
        type: 'get',
        url: '/api/userid'
    });
}
// Retrieve val and return as Promise state
let id_ = async () => {

    try {
        const user = await fetch_id();
        return user;
    } catch (err) {
        console.log(err);
    }

}