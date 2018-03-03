/*
  RSI - WR 
  Version by zzmike76

  If you want to donate...
  BTC --> 1CrtuDp6J8bwVsiPFacqMVNwQnhUp14UPF
  ETH --> 0x93f63b86b1b8a2db15f9151349fc69e2a878bb07
  NEO --> ANe8mxdBdbupkmnwRdx3a9UE3NeqV1WVPA

 */

// helpers
var _ = require('lodash');
var log = require('../core/log.js');
var RSI = require('./indicators/RSI.js');
this.stop = "";

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  this.name = 'RSI_WR';
  var stoploss = this.settings.stoploss;
  this.debug = false  ;

  var customWRSettings = {
    optInTimePeriod: this.settings.optInTimePeriod
  }

  // define the indicators we need
  this.addIndicator('rsi', 'RSI', this.settings);
  this.addTulipIndicator('mywr', 'willr', customWRSettings);

}

method.log = function(candle) {
  var rsi = this.indicators.rsi;
  var rsiVal = rsi.result.toFixed(2);
  var wr = this.tulipIndicators.mywr.result.result;
  
  if( this.debug ) log.debug('\t', 'RSI: ', rsiVal);
  if( this.debug ) log.debug('\t', 'WR: ' + wr);
  if( this.debug ) log.debug('\t', 'Price: ', candle.close.toFixed(2));

}

method.check = function(candle) {
  var rsi = this.indicators.rsi;
  var rsiVal = rsi.result.toFixed(2);
  var wr = this.tulipIndicators.mywr.result.result;

  if(rsiVal > this.settings.high && wr > this.settings.up) {

      this.advice('short');
      this.stop = "";
      if( this.debug ) log.debug('Going short, ' + "WR: " + wr.toFixed(2) + ' RSI: ' + rsiVal);

  } else if(rsiVal < this.settings.low && wr < this.settings.down) {

   
      this.advice('long');
      this.stop = candle.close * this.settings.stoploss;
      if( this.debug ) log.debug('Going long, ' + "WR: " + wr.toFixed(2) + ' RSI: ' + rsiVal+  ' stoploss at ' + this.stop.toFixed(4)) ;

  } else {
    if(candle.close < this.stop && this.settings.stop){
      if( this.debug ) log.debug('Stop loss triggered !!! ' + "WR: " + wr.toFixed(2) + ' RSI: ' + rsiVal + ' Stoploss: ' + this.stop.toFixed(4) + ' Price: ' + candle.close);
      this.advice('short');
      this.stop = "";

    }
    
    else {
      if( this.debug ) log.debug('Doing nothing!');
      this.advice();
    }
  
  }
}

module.exports = method;
