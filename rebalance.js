
function append_btton() {

    // Append button

    var button = '<a class="header__controls-button ng-binding rebalance_button" href="" onclick="return false;">'
            + '<i aria-hidden="true" data-dg-icon="pie-chart" class="icon icon-pie-chart"></i>'
            + 'Rebalancear'
            + '</a>';
        
    $('.header__controls-toolbar').append(button);

    $('.icon-pie-chart').css({
        'margin-right': '5px'
    });
}

function append_input() {

    // Append input

    var input = '<input class="dashboard__amount_invs rebalance_input rebalance_variable" type="text" value="0">';

    $('.header__controls-toolbar').append(input);

    $('.rebalance_input').css({
        'display': 'none',
        'color': '#919191',
        'height': '30px'
    });
}

function append_table() {

    // Append table

    $('.rebalance_table').remove();

    var table = '<div class="rebalance_table">'
            + '<table class="portfolio__table">'
            + '<thead>'
            + '<tr>'
            + '<th><span>Produto</span></th>'
            + '<th><span>% Objectivo</span></th>'
            + '<th><span>% Actual</span></th>'
            + '<th><span>% Final</span></th>'
            + '<th><span>Comprar</span></th>'
            + '</tr>'
            + '</thead>'
            + '<tbody>';

    $('.portfolio__table-cell_product-name a').each(function () {
        table = table
                + '<tr>'
                + '<td><span>' + this.title + '</span></td>'
                + '<td><span><input class="pdesir rebalance_variable" type="text" value="0"></span></td>'
                + '<td><span class="piniti">0</span></td>'
                + '<td><span class="pfinal">0</span></td>'
                + '<td><span class="orders">0</span></td>'
                + '</tr>';
    });

    table = table
            + '</tbody>'
            + '</table>'
            + '</div>';

    $('.dashboard__content').append(table);

    $('.rebalance_table').css({
        'display': 'none',
        'margin-bottom': '20px'
    });

    $('.rebalance_table input').css({
        'height': '25px'
    });

    $('.rebalance_variable').css({
        'border': '1px solid #DDDDDD',
        'border-radius': '4px',
        'padding': '7px',
        'font-size': '12px'
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function remove_btton() {

    // Remove button

    $('.rebalance_button').remove();
}

function remove_input() {

    // Remove input

    $('.rebalance_input').remove();
}

function remove_table() {

    // Remove table

    $('.rebalance_table').remove();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function read_invest() {

    // Read invested value

    return parseFloat($('*[data-dg-watch-property="portfolio"]').text().replace('.', '').replace(',', '.'));
}

function read_excedn() {

    // Read exceding value

    return parseFloat($('*[data-dg-watch-property="valueByCostsType"]').text().replace('.', '').replace(',', '.'));
}

function read_portfl() {

    // Read portfolio value

    var invested = read_invest();
    var exceding = read_excedn();

    return invested + exceding;
}

function read_rnfrcm() {

    // Read reinforcement value

    return parseFloat($('.dashboard__amount_invs').val().replace('.', '').replace(',', '.'));
}

function read_anames() {

    // Read assets names

    var names = [];

    $('.portfolio__table-cell_product-name a').each(function () {
        names.push(this.title);
    });

    return names;
}

function read_values() {

    // Read assets value

    var values = [];

    $('.portfolio__table-cell_price span').each(function () {
        values.push(parseFloat($(this).text().replace('.', '').replace(',', '.')));
    });

    return values;
}

function read_amount() {

    // Read assets quantity

    var amount = [];

    $('.portfolio__table-cell_size span').each(function () {
        amount.push(parseFloat($(this).text().replace('.', '').replace(',', '.')));
    });

    return amount;
}

function read_pdesir() {

    // Read desired proportions

    var pdesir = [];

    $('.pdesir').each(function () {
        pdesir.push(parseFloat($(this).val().replace('.', '').replace(',', '.')));
    });

    return pdesir;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function write_orders(orders) {

    // Write buying orders

    $('.orders').each(function (i) {
        $(this).text(orders[i]);
    });
}

function write_piniti(piniti) {

    // Write initial proportions

    $('.piniti').each(function (i) {
        $(this).text(piniti[i].toFixed(1));
    });
}

function write_pfinal(pfinal) {

    // Write final proportions

    $('.pfinal').each(function (i) {
        $(this).text(pfinal[i].toFixed(1));
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function calculate_totalc() {

    // Calculate total assets count

    return $('.portfolio__table-cell_position-value span').length;
}

function calculate_totalt() {

    // Calculate total assets value

    var total = 0;

    $('.portfolio__table-cell_position-value span').each(function () {
        total = total + parseFloat($(this).text().replace('.', '').replace(',', '.'));
    });

    return total;
}

function calculate_totalm(portfl, rnfrcm) {

    // Calculate total money

    return portfl + rnfrcm;
}

function calculate_piniti(values, amount, portfl) {

    // Calculate current percentages                

    var piniti = [];

    $('.piniti').each(function (i) {
        piniti.push((values[i] * amount[i] / portfl) * 100);
    });

    return piniti;
}

function calculate_pfinal(orders, totalm, values, amount) {

    // Calculate final percentages

    var pfinal = [];

    $('.pfinal').each(function (i) {
        pfinal.push((orders[i] + amount[i]) * values[i] / totalm * 100);
    });

    return pfinal;
}

function calculate_orders(pdesir, totalm, values, amount) {

    // Calculate buying orders

    var orders = [];

    $('.orders').each(function (i) {
        orders.push(Math.floor((pdesir[i] * totalm / 100) / values[i]) - amount[i]);
    });

    return orders;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function setup_anims() {

    // Setup animations

    $('.rebalance_button').on('click', function () {
        $('.rebalance_table').animate({height: 'toggle'});
        $('.rebalance_input').animate({width: 'toggle'});
    });
}

function setup_logic() {

    // Setup logic

    $('.rebalance_variable').on('input', function () {

        var portfl;
        var rnfrcm;
        var totalm;

        var piniti = [];
        var pdesir = [];
        var pfinal = [];

        var values = [];
        var amount = [];
        var orders = [];

        // Read data

        portfl = read_portfl();
        rnfrcm = read_rnfrcm();

        values = read_values();
        amount = read_amount();

        pdesir = read_pdesir();

        // Calculate values

        totalm = calculate_totalm(portfl, rnfrcm);
        piniti = calculate_piniti(values, amount, portfl);
        orders = calculate_orders(pdesir, totalm, values, amount);
        pfinal = calculate_pfinal(orders, totalm, values, amount);

        // Update interface

        write_piniti(piniti);
        write_orders(orders);
        write_pfinal(pfinal);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function script_ready() {

    // Check data

    var invested = read_invest();

    var count = calculate_totalc();
    var total = calculate_totalt();
    
    if (count === 0) {
        return false;
    }
        
    if (count !== read_anames().length) {
        return false;
    }

    if (count !== read_values().length) {
        return false;
    }

    if (count !== read_amount().length) {
        return false;
    }
    
    if (Math.abs(invested - total) > 0.1) {
        return false;
    }
    
    return true;
}

function script_start() {

    // Run script

    append_btton();
    append_input();
    append_table();

    setup_anims();
    setup_logic();
}

function script_clear() {

    // Remove elements

    remove_btton();
    remove_input();
    remove_table();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function execute() {

    var cron;    
    var interval = 250;
    var prefix = 'https://trader.degiro.nl/trader/#!/portfolio';
            
    if (window.location.href.startsWith(prefix)) {
                
        cron = window.setInterval(function () {

            if (script_ready()) {
                
                clearInterval(cron);
                script_start();
            }

        }, interval);
    }

    $(window).on('hashchange', function () {
                
        clearInterval(cron);
        script_clear();

        if (window.location.href.startsWith(prefix)) {

            cron = window.setInterval(function () {

                if (script_ready()) {

                    clearInterval(cron);
                    script_start();
                }

            }, interval);
        }
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

execute();