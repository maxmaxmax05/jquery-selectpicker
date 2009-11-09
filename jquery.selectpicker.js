/**
 *---------------------------------------------------------
 * jQuery SelectPicker
 *=========================================================
 * 
 * Usage:
 *
 * <select id="my-picker" size="12" multiple="multiple">
 *  <option>1</option>
 *  <option>2</option>
 *  <option>3</option>
 * </select>
 *
 * $('#my-picker).selectPicker({label: 'Option'});
 *
 *-----------------------------------------------------------
 * Authors: 
 *  Ben Vinegar (ben@freshbooks.com)
 *  Jaco Joubert (jaco@freshbooks.com)
 *
 * Copyright (c) 2009 FreshBooks. Distributed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.selectPicker = function(opts) {
		var opts = $.extend({}, $.fn.selectPicker.defaults, opts);
		
		return this.each(function() {
			new $.selectPicker(this, opts);
		});
	};
	
	$.fn.selectPicker.defaults = {
		width: '250px'
	};
	
	$.selectPicker = function(select, opts) {
		var $select = $(select);

		// Build window
		var $combobox = $('\
			<a class="selectpicker">\
				<span class="innards">\
					<span class="cutoff selectpicker-title">\
					</span>\
				</span>\
			</a>\
		').insertBefore($select).css('width', $select.width());
		
		var _updateTitle = function() {
			var title = '';

			var $selectedOpts = $select.find('option:selected');
			switch ($selectedOpts.length) {
				case 0:  title = 'All ' + opts.label; break;
				case 1:  title = $selectedOpts.filter(':first').text(); break;
				default: title = $selectedOpts.length + ' ' + opts.label; break;
			}

			$combobox.find('span.selectpicker-title').text(title);
		}
		_updateTitle();
		
		$select.wrap('\
			<div class="selectpicker-window" style="display:none; position: absolute"></div>\
		').parent().width(opts.width);
		
		$select.after('\
			<p>\
				Hold down the CTRL or &#8984; key to <br />\
				select multiple rows.\
			</p>\
			<span class="selectpicker-window-close">\
				<a href="#" class="selectpicker-close">Finish</a>&nbsp;&nbsp;&nbsp;\
				<a href="#" class="selectpicker-clear">Clear</a>\
			</span>\
		');

		var $window = $select.parent();

		var _documentClick = function(e) {
			var $target = $(e.target||e.srcElement);
			
			// Click the clear button?
			if ($target.is('.selectpicker-clear')) {
				$select.find('option:selected').removeAttr('selected');
				_updateTitle();
				return false;
			}
			// Did they click the close button? Or click outside the window?
			else if ($target.is('.selectpicker-close') || !$target.closest('div').is('.selectpicker-window')) {
				_hideSelect();
			}
		}
		var _hideSelect = function() {
			// Hide any other open ones
			$('div.selectpicker-window').hide();
			$('a.selectpicker').removeClass('active');
			$(document).unbind('click', _documentClick);
		}
		var _revealSelect = function() {
			_hideSelect();
			
			$combobox.addClass('active');
			var position = $combobox.position();

			var heightOffset = 2;
			$window.
				css('left', position.left + 'px').
				css('top', position.top + $combobox.height() + heightOffset + 'px');

			$window.toggle().find('select').focus();
		}

		$select.change(function() {
			_updateTitle();
		});
		
		$combobox.click(function() {
			if ($window.is(':visible')) {
				_hideSelect();
			} else {
				_revealSelect();
				$(document).click(_documentClick);
			}
			return false;
		});
	}
})(jQuery);