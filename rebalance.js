
function Script() {

    this.cron;

    this.listen_change_page();
    this.listen_change_url();
}

Script.prototype.execute = function () {

    var self = this;

    $(document).on('execute', function () {

        clearInterval(self.cron);

        self.remove_btton();
        self.remove_input();
        self.remove_table();

        if (window.location.href.startsWith('https://trader.degiro.nl/trader/#/portfolio')) {

            self.cron = window.setInterval(function () {

                if (self.ready()) {

                    clearInterval(self.cron);

                    self.append_btton();
                    self.append_input();
                    self.append_table();

                    self.setup_anims();
                    self.setup_logic();
                }

            }, 250);
        }
    });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.listen_change_page = function () {

    // Execute script when page reloads

    $(document).ready(function () {
        $(document).trigger('execute');
    });
};

Script.prototype.listen_change_url = function () {

    // Execute script when url changes

    $(window).on('hashchange', function () {
        $(document).trigger('execute');
    });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.append_btton = function () {

    // Append button

    var button = '<a class="header__controls-button ng-binding rebalance_button" href="" onclick="return false;">'
            + 'Rebalancear'
            + '</a>';

    $('.header__controls-toolbar').append(button);

    $('.icon-pie-chart').css({
        'margin-right': '5px'
    });
};

Script.prototype.append_input = function () {

    // Append input

    var input = '<input class="dashboard__amount_invs rebalance_input rebalance_variable" type="text" value="0">';

    $('.header__controls-toolbar').append(input);

    $('.rebalance_input').css({
        'display': 'none',
        'color': '#919191',
        'height': '30px'
    });
};

Script.prototype.append_table = function () {

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
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.remove_btton = function () {

    // Remove button

    $('.rebalance_button').remove();
};

Script.prototype.remove_input = function () {

    // Remove input

    $('.rebalance_input').remove();
};

Script.prototype.remove_table = function () {

    // Remove table

    $('.rebalance_table').remove();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.read_invest = function () {

    // Read invested value

    return parseFloat($('*[data-field="portfolio"]').text().replace('.', '').replace(',', '.'));
};

Script.prototype.read_excedn = function () {

    // Read exceding value

    return parseFloat($('*[data-field="valueByCostsType"]').text().replace('.', '').replace(',', '.'));
};

Script.prototype.read_portfl = function () {

    // Read portfolio value

    var self = this;

    var invested = self.read_invest();
    var exceding = self.read_excedn();

    return invested + exceding;
};

Script.prototype.read_rnfrcm = function () {

    // Read reinforcement value

    return parseFloat($('.dashboard__amount_invs').val().replace('.', '').replace(',', '.'));
};

Script.prototype.read_anames = function () {

    // Read assets names

    var names = [];

    $('.portfolio__table-cell_product-name a').each(function () {
        names.push(this.title);
    });

    return names;
};

Script.prototype.read_values = function () {

    // Read assets value

    var values = [];

    $('.portfolio__table-cell_price span').each(function () {
        values.push(parseFloat($(this).text().replace('.', '').replace(',', '.')));
    });

    return values;
};

Script.prototype.read_amount = function () {

    // Read assets quantity

    var amount = [];

    $('.portfolio__table-cell_size span').each(function () {
        amount.push(parseFloat($(this).text().replace('.', '').replace(',', '.')));
    });

    return amount;
};

Script.prototype.read_pdesir = function () {

    // Read desired proportions

    var pdesir = [];

    $('.pdesir').each(function () {
        pdesir.push(parseFloat($(this).val()));
    });

    return pdesir;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.write_orders = function (orders) {

    // Write buying orders

    $('.orders').each(function (i) {
        $(this).text(orders[i]);
    });
};

Script.prototype.write_piniti = function (piniti) {

    // Write initial proportions

    $('.piniti').each(function (i) {
        $(this).text(piniti[i].toFixed(1));
    });
};

Script.prototype.write_pfinal = function (pfinal) {

    // Write final proportions

    $('.pfinal').each(function (i) {
        $(this).text(pfinal[i].toFixed(1));
    });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.calculate_totalc = function () {

    // Calculate total assets count

    return $('.portfolio__table-cell_position-value span').length;
};

Script.prototype.calculate_totalt = function () {

    // Calculate total assets value

    var total = 0;

    $('.portfolio__table-cell_position-value span').each(function () {
        total = total + parseFloat($(this).text().replace('.', '').replace(',', '.'));
    });

    return total;
};

Script.prototype.calculate_totalm = function (portfl, rnfrcm) {

    // Calculate total money

    return portfl + rnfrcm;
};

Script.prototype.calculate_piniti = function (values, amount, portfl) {

    // Calculate current percentages                

    var piniti = [];

    $('.piniti').each(function (i) {
        piniti.push((values[i] * amount[i] / portfl) * 100);
    });

    return piniti;
};

Script.prototype.calculate_pfinal = function (orders, totalm, values, amount) {

    // Calculate final percentages

    var pfinal = [];

    $('.pfinal').each(function (i) {
        pfinal.push((orders[i] + amount[i]) * values[i] / totalm * 100);
    });

    return pfinal;
};

Script.prototype.calculate_orders = function (pdesir, totalm, values, amount) {

    // Calculate buying orders

    var orders = [];

    $('.orders').each(function (i) {
        orders.push(Math.floor((pdesir[i] * totalm / 100) / values[i]) - amount[i]);
    });

    return orders;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.setup_anims = function () {

    // Setup animations

    $('.rebalance_button').on('click', function () {
        $('.rebalance_table').animate({height: 'toggle'});
        $('.rebalance_input').animate({width: 'toggle'});
    });
};

Script.prototype.setup_logic = function () {

    // Setup logic

    var self = this;

    $('.rebalance_variable').on('input', function () {

        var invest;
        var rnfrcm;
        var totalm;

        var piniti = [];
        var pdesir = [];
        var pfinal = [];

        var values = [];
        var amount = [];
        var orders = [];

        // Read data
        
        invest = self.read_invest();
        rnfrcm = self.read_rnfrcm();

        values = self.read_values();
        amount = self.read_amount();

        pdesir = self.read_pdesir();

        // Calculate values

        totalm = self.calculate_totalm(invest, rnfrcm);
        piniti = self.calculate_piniti(values, amount, invest);
        orders = self.calculate_orders(pdesir, totalm, values, amount);
        pfinal = self.calculate_pfinal(orders, totalm, values, amount);

        // Update interface

        self.write_piniti(piniti);
        self.write_orders(orders);
        self.write_pfinal(pfinal);
    });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

Script.prototype.ready = function () {

    // Check data

    var self = this;

    var invested = self.read_invest();

    var count = self.calculate_totalc();
    var total = self.calculate_totalt();

    if (count === 0) {
        return false;
    }

    if (count !== self.read_anames().length) {
        return false;
    }

    if (count !== self.read_values().length) {
        return false;
    }

    if (count !== self.read_amount().length) {
        return false;
    }

    if (Math.abs(invested - total) > 0.1) {
        return false;
    }

    return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

var script = new Script();

script.execute();
