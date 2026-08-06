$(function () {
    /* Ask for confirmation before the (soft) delete is posted. */
    $('.js-confirm-form').on('submit', function (event) {
        var form = this;

        if ($(form).data('confirmed')) {
            return true;
        }

        event.preventDefault();

        abp.message.confirm($(form).data('confirm-message')).then(function (confirmed) {
            if (confirmed) {
                $(form).data('confirmed', true);
                form.submit();
            }
        });

        return false;
    });
});
