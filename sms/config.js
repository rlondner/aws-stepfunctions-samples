var cfg = {};

cfg.smsTemplate = "Here's the restaurant you're looking for: {{#restaurants}}{{name}}, {{address.building}} {{address.street}}, {{borough}} {{address.zipcode}}{{/restaurants}}";

module.exports = cfg;
