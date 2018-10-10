/**
 * user forbid
 */

function checkForbid() {
  var state;
  var $forbidModal;
  $('.J_forbid-btn').click(function() {
    $forbidModal = $(this).parents('.J_forbid-modal');
    state = $forbidModal.find('.J_text-switch').data('state');
    if (state) {
      $forbidModal.find('.J_text-switch').addClass('disabled');
    } else {
      $forbidModal.find('.J_text-switch').removeClass('disabled');
    }
    $forbidModal.find('.J_forbid-time').attr('disabled', false);
    $forbidModal.find('.J_forbid-while').removeClass('disabled');
  });
  $('.J_start-btn').click(function() {
    $forbidModal = $(this).parents('.J_forbid-modal');
    state = $forbidModal.find('.J_text-switch').data('state');
    if (state) {
      $forbidModal.find('.J_text-switch').removeClass('disabled');
    } else {
      $forbidModal.find('.J_text-switch').addClass('disabled');
    }
    $forbidModal.find('.J_forbid-time').attr('disabled', true);
    $forbidModal.find('.J_forbid-while').addClass('disabled');
  });
}

function init() {
  checkForbid();
}

module.exports = function() {
  init();
};
