$(function () {
    var l = abp.localization.getResource('FeatureRequestPortal');
    var statusFilter = $('#StatusFilter');

    /* The status is serialized as a number, but keep the enum name working too. */
    var statusNames = ['Pending', 'Approved', 'Rejected', 'Planned', 'Completed', 'Cancelled'];
    var statusStyles = ['secondary', 'success', 'danger', 'info', 'primary', 'dark'];

    function statusValue(data) {
        if (typeof data === 'number') {
            return data;
        }

        var index = statusNames.indexOf(data);
        return index < 0 ? 0 : index;
    }

    function renderStatus(data) {
        var value = statusValue(data);
        return '<span class="badge bg-' + statusStyles[value] + '">' +
            abp.utils.htmlEscape(l('Enum:FeatureRequestStatus.' + value)) +
            '</span>';
    }

    function renderTitle(data, type, row) {
        return '<a href="/FeatureRequests/Detail?id=' + encodeURIComponent(row.id) + '">' +
            abp.utils.htmlEscape(data) +
            '</a>';
    }

    function renderDate(data) {
        return luxon.DateTime.fromISO(data, { locale: abp.localization.currentCulture.name })
            .toLocaleString(luxon.DateTime.DATETIME_SHORT);
    }

    var dataTable = $('#FeatureRequestsTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            /* No initial ordering: the server falls back to "newest first". */
            order: [],
            searching: false,
            pageLength: 15,
            /* The server only honours these sizes (FeatureRequestConsts.AllowedPageSizes). */
            lengthChange: true,
            lengthMenu: [15, 20, 30, 50],
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(
                featureRequestPortal.featureRequests.featureRequest.getList,
                function () {
                    /* The filter is not rendered for visitors, so val() is undefined there and
                     * parseInt would send NaN. Anything non-numeric means "no status filter". */
                    var status = parseInt(statusFilter.val(), 10);
                    return {
                        status: isNaN(status) ? null : status
                    };
                }
            ),
            columnDefs: [
                {
                    title: l('Title'),
                    data: 'title',
                    orderable: false,
                    render: renderTitle
                },
                {
                    title: l('VoteCount'),
                    data: 'voteCount',
                    orderable: true
                },
                {
                    title: l('Status'),
                    data: 'status',
                    orderable: false,
                    render: renderStatus
                },
                {
                    title: l('CreationTime'),
                    data: 'creationTime',
                    orderable: true,
                    render: renderDate
                }
            ]
        })
    );

    statusFilter.on('change', function () {
        dataTable.ajax.reload();
    });
});
