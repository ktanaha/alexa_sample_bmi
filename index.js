/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.e3283c39-ea2a-4363-947c-bb66df9be0ba';

const states = {
    ASKED_HEIGHT: '_HEIGHT',
    ASKED_WEIGHT: '_WEIGHT'
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, askedHeightHandlers, askedWeightHandlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.StartOverIntent');
    },
    'AMAZON.StartOverIntent': function() {
        this.attributes['height'] = '';
        this.attributes['weight'] = '';
        this.handler.state = '';
        this.emit(':ask', 'BMIの測定をします。まずは身長を教えてください');
    },

    'AMAZON.HelpIntent': function () {
        const message ='BMIの測定をします。身長と体重を教えてください';
        this.emit(':ask', message, message);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('終了します'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('終了します'));
    },
    'HeightIntent': function () {
        var height = this.event.request.intent.slots.Height.value;
        this.handler.state = states.ASKED_HEIGHT;
        this.attributes['height'] = height;
        this.emit(':ask', '体重を教えてください');
    },
    'WeightIntent': function () {
        var weight = this.event.request.intent.slots.Weight.value;
        this.handler.state = states.ASKED_WEIGHT;
        this.attributes['weight'] = weight;
        this.emit(':ask', '身長を教えてください');
    },
};

const askedHeightHandlers = Alexa.CreateStateHandler(states.ASKED_HEIGHT, {
    'WeightIntent': function () {
        this.handler.state = '';
        this.attributes['STATE'] = undefined;

        const weight = Number(this.event.request.intent.slots.Weight.value);
        const height = Number(this.attributes['height']) / 100;
        
        this.emit(':tell', 'あなたのBMIは' + String(weight / (height * height)) + 'です');
    },
});

const askedWeightHandlers = Alexa.CreateStateHandler(states.ASKED_WEIGHT, {
    'HeightIntent': function () {
        this.handler.state = '';
        this.attributes['STATE'] = undefined;
        
        const height = Number(this.event.request.intent.slots.Height.value) / 100;
        const weight = Number(this.attributes['weight']);

        this.emit(':tell', 'あなたのBMIは' + String(weight / (height * height)) + 'です');
    },
});