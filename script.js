let mobileNav = false;

function onResize() {
  const helpOuterBox = document.querySelector('#details');
  const mainContent = document.querySelector('#main-content');
  const mediaQuery = '(min-width: 240px) and (max-width: 420px) and ' + '(min-height: 401px), ' + '(max-height: 560px) and (min-height: 240px) and ' + '(min-width: 421px)';
  const detailsHidden = helpOuterBox.classList.contains(HIDDEN_CLASS);
  const runnerContainer = document.querySelector('.runner-container');
  if (mobileNav !== window.matchMedia(mediaQuery).matches) {
    mobileNav = !mobileNav;
    if (mobileNav) {
      mainContent.classList.toggle(HIDDEN_CLASS, !detailsHidden);
      helpOuterBox.classList.toggle(HIDDEN_CLASS, detailsHidden);
      if (runnerContainer) {
        runnerContainer.classList.toggle(HIDDEN_CLASS, !detailsHidden);
      }
    } else if (!detailsHidden) {
      mainContent.classList.remove(HIDDEN_CLASS);
      helpOuterBox.classList.remove(HIDDEN_CLASS);
      if (runnerContainer) {
        runnerContainer.classList.remove(HIDDEN_CLASS);
      }
    }
  }
}

function setupMobileNav() {
  window.addEventListener('resize', onResize);
  onResize();
}
document.addEventListener('DOMContentLoaded', setupMobileNav);
var certificateErrorPageController;
const SecurityInterstitialCommandId = {
  CMD_DONT_PROCEED: 0,
  CMD_PROCEED: 1,
  CMD_SHOW_MORE_SECTION: 2,
  CMD_OPEN_HELP_CENTER: 3,
  CMD_OPEN_DIAGNOSTIC: 4,
  CMD_RELOAD: 5,
  CMD_OPEN_DATE_SETTINGS: 6,
  CMD_OPEN_LOGIN: 7,
  CMD_DO_REPORT: 8,
  CMD_DONT_REPORT: 9,
  CMD_OPEN_REPORTING_PRIVACY: 10,
  CMD_OPEN_WHITEPAPER: 11,
  CMD_REPORT_PHISHING_ERROR: 12,
  CMD_OPEN_ENHANCED_PROTECTION_SETTINGS: 13,
};
const HIDDEN_CLASS = 'hidden';

function sendCommand(cmd) {
  if (window.certificateErrorPageController) {
    switch (cmd) {
    case SecurityInterstitialCommandId.CMD_DONT_PROCEED:
      certificateErrorPageController.dontProceed();
      break;
    case SecurityInterstitialCommandId.CMD_PROCEED:
      certificateErrorPageController.proceed();
      break;
    case SecurityInterstitialCommandId.CMD_SHOW_MORE_SECTION:
      certificateErrorPageController.showMoreSection();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_HELP_CENTER:
      certificateErrorPageController.openHelpCenter();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_DIAGNOSTIC:
      certificateErrorPageController.openDiagnostic();
      break;
    case SecurityInterstitialCommandId.CMD_RELOAD:
      certificateErrorPageController.reload();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_DATE_SETTINGS:
      certificateErrorPageController.openDateSettings();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_LOGIN:
      certificateErrorPageController.openLogin();
      break;
    case SecurityInterstitialCommandId.CMD_DO_REPORT:
      certificateErrorPageController.doReport();
      break;
    case SecurityInterstitialCommandId.CMD_DONT_REPORT:
      certificateErrorPageController.dontReport();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_REPORTING_PRIVACY:
      certificateErrorPageController.openReportingPrivacy();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_WHITEPAPER:
      certificateErrorPageController.openWhitepaper();
      break;
    case SecurityInterstitialCommandId.CMD_REPORT_PHISHING_ERROR:
      certificateErrorPageController.reportPhishingError();
      break;
    case SecurityInterstitialCommandId.CMD_OPEN_ENHANCED_PROTECTION_SETTINGS:
      certificateErrorPageController.openEnhancedProtectionSettings();
      break;
    }
    return;
  }
  window.domAutomationController.send(cmd);
}

function preventDefaultOnPoundLinkClicks() {
  const anchors = document.body.querySelectorAll('a[href="#"]');
  for (const anchor of anchors) {
    anchor.addEventListener('click', e => e.preventDefault());
  }
}
let expandedDetails = false;
let keyPressState = 0;

function handleKeypress(e) {
  const BYPASS_SEQUENCE = window.atob('dGhpc2lzdW5zYWZl');
  if (BYPASS_SEQUENCE.charCodeAt(keyPressState) === e.keyCode) {
    keyPressState++;
    if (keyPressState === BYPASS_SEQUENCE.length) {
      sendCommand(SecurityInterstitialCommandId.CMD_PROCEED);
      keyPressState = 0;
    }
  } else {
    keyPressState = 0;
  }
}

function appendDebuggingField(title, value, fixedWidth) {
  const spanTitle = document.createElement('span');
  spanTitle.classList.add('debugging-title');
  spanTitle.innerText = title + ': ';
  const spanValue = document.createElement('span');
  spanValue.classList.add('debugging-content');
  if (fixedWidth) {
    spanValue.classList.add('debugging-content-fixed-width');
  }
  spanValue.innerText = value;
  const pElem = document.createElement('p');
  pElem.classList.add('debugging-content');
  pElem.appendChild(spanTitle);
  pElem.appendChild(spanValue);
  document.querySelector('#error-debugging-info').appendChild(pElem);
}

function toggleDebuggingInfo() {
  const hiddenDebug = document.querySelector('#error-debugging-info').classList.toggle(HIDDEN_CLASS);
  document.querySelector('#error-code').setAttribute('aria-expanded', !hiddenDebug);
}

function setupEvents() {
  const overridable = loadTimeData.getBoolean('overridable');
  const interstitialType = loadTimeData.getString('type');
  const ssl = interstitialType === 'SSL';
  const captivePortal = interstitialType === 'CAPTIVE_PORTAL';
  const badClock = ssl && loadTimeData.getBoolean('bad_clock');
  const lookalike = interstitialType === 'LOOKALIKE';
  const billing = interstitialType === 'SAFEBROWSING' && loadTimeData.getBoolean('billing');
  const blockedInterception = interstitialType === 'BLOCKED_INTERCEPTION';
  const insecureForm = interstitialType == 'INSECURE_FORM';
  const httpsOnly = interstitialType == 'HTTPS_ONLY';
  const hidePrimaryButton = loadTimeData.getBoolean('hide_primary_button');
  const showRecurrentErrorParagraph = loadTimeData.getBoolean('show_recurrent_error_paragraph');
  const body = document.querySelector('#body');
  if (ssl || blockedInterception) {
    body.classList.add(badClock ? 'bad-clock' : 'ssl');
    if (loadTimeData.valueExists('errorCode')) {
      const errorCode = document.querySelector('#error-code');
      errorCode.textContent = loadTimeData.getString('errorCode');
      errorCode.classList.remove(HIDDEN_CLASS);
    }
  } else if (captivePortal) {
    body.classList.add('captive-portal');
  } else if (billing) {
    body.classList.add('safe-browsing-billing');
  } else if (lookalike) {
    body.classList.add('lookalike-url');
  } else if (insecureForm) {
    body.classList.add('insecure-form');
  } else if (httpsOnly) {
    body.classList.add('https-only');
  } else {
    body.classList.add('safe-browsing');
    document.querySelector('meta[name=theme-color]').setAttribute('content', 'rgb(217, 48, 37)');
  }
  document.querySelector('#icon').classList.add('icon');
  const primaryButton = document.querySelector('#primary-button');
  if (hidePrimaryButton) {
    primaryButton.classList.add(HIDDEN_CLASS);
  } else {
    primaryButton.addEventListener('click', function () {
      switch (interstitialType) {
      case 'CAPTIVE_PORTAL':
        sendCommand(SecurityInterstitialCommandId.CMD_OPEN_LOGIN);
        break;
      case 'SSL':
        if (badClock) {
          sendCommand(SecurityInterstitialCommandId.CMD_OPEN_DATE_SETTINGS);
        } else if (overridable) {
          sendCommand(SecurityInterstitialCommandId.CMD_DONT_PROCEED);
        } else {
          sendCommand(SecurityInterstitialCommandId.CMD_RELOAD);
        }
        break;
      case 'SAFEBROWSING':
      case 'ORIGIN_POLICY':
        sendCommand(SecurityInterstitialCommandId.CMD_DONT_PROCEED);
        break;
      case 'HTTPS_ONLY':
      case 'INSECURE_FORM':
      case 'LOOKALIKE':
        sendCommand(SecurityInterstitialCommandId.CMD_DONT_PROCEED);
        break;
      default:
        throw new Error('Invalid interstitial type');
      }
    });
  }
  if (lookalike || insecureForm || httpsOnly) {
    const proceedButton = document.querySelector('#proceed-button');
    proceedButton.classList.remove(HIDDEN_CLASS);
    proceedButton.textContent = loadTimeData.getString('proceedButtonText');
    proceedButton.addEventListener('click', function (event) {
      sendCommand(SecurityInterstitialCommandId.CMD_PROCEED);
    });
  }
  if (lookalike) {
    const dontProceedLink = document.querySelector('#dont-proceed-link');
    if (dontProceedLink) {
      dontProceedLink.addEventListener('click', function (event) {
        sendCommand(SecurityInterstitialCommandId.CMD_DONT_PROCEED);
      });
    }
  }
  if (overridable) {
    const overrideElement = document.querySelector(billing ? '#proceed-button' : '#proceed-link');
    overrideElement.addEventListener('click', function (event) {
      sendCommand(SecurityInterstitialCommandId.CMD_PROCEED);
    });
    if (ssl) {
      overrideElement.classList.add('small-link');
    } else if (billing) {
      overrideElement.classList.remove(HIDDEN_CLASS);
      overrideElement.textContent = loadTimeData.getString('proceedButtonText');
    }
  } else if (!ssl) {
    document.querySelector('#final-paragraph').classList.add(HIDDEN_CLASS);
  }
  if (!ssl || !showRecurrentErrorParagraph) {
    document.querySelector('#recurrent-error-message').classList.add(HIDDEN_CLASS);
  } else {
    body.classList.add('showing-recurrent-error-message');
  }
  const diagnosticLink = document.querySelector('#diagnostic-link');
  if (diagnosticLink) {
    diagnosticLink.addEventListener('click', function (event) {
      sendCommand(SecurityInterstitialCommandId.CMD_OPEN_DIAGNOSTIC);
    });
  }
  const learnMoreLink = document.querySelector('#learn-more-link');
  if (learnMoreLink) {
    learnMoreLink.addEventListener('click', function (event) {
      sendCommand(SecurityInterstitialCommandId.CMD_OPEN_HELP_CENTER);
    });
  }
  const detailsButton = document.querySelector('#details-button');
  if (captivePortal || billing || lookalike || insecureForm || httpsOnly) {
    detailsButton.classList.add('hidden');
  } else {
    detailsButton.setAttribute('aria-expanded', !document.querySelector('#details').classList.contains(HIDDEN_CLASS));
    detailsButton.addEventListener('click', function (event) {
      const hiddenDetails = document.querySelector('#details').classList.toggle(HIDDEN_CLASS);
      detailsButton.setAttribute('aria-expanded', !hiddenDetails);
      const mainContent = document.querySelector('#main-content');
      if (mobileNav) {
        mainContent.classList.toggle(HIDDEN_CLASS, !hiddenDetails);
      } else {
        mainContent.classList.remove(HIDDEN_CLASS);
      }
      detailsButton.innerText = hiddenDetails ? loadTimeData.getString('openDetails') : loadTimeData.getString('closeDetails');
      if (!expandedDetails) {
        sendCommand(SecurityInterstitialCommandId.CMD_SHOW_MORE_SECTION);
        expandedDetails = true;
      }
    });
  }
  const reportErrorLink = document.querySelector('#report-error-link');
  if (reportErrorLink) {
    reportErrorLink.addEventListener('click', function (event) {
      sendCommand(SecurityInterstitialCommandId.CMD_REPORT_PHISHING_ERROR);
    });
  }
  if (lookalike) {
    console.warn(loadTimeData.getString('lookalikeConsoleMessage'));
  }
  preventDefaultOnPoundLinkClicks();
  setupExtendedReportingCheckbox();
  setupEnhancedProtectionMessage();
  setupSSLDebuggingInfo();
  document.addEventListener('keypress', handleKeypress);
}
document.addEventListener('DOMContentLoaded', setupEvents);
var loadTimeData;
class LoadTimeData {
  constructor() {
    this.data_ = null;
  }
  set data(value) {
    expect(!this.data_, 'Re-setting data.');
    this.data_ = value;
  }
  valueExists(id) {
    return id in this.data_;
  }
  getValue(id) {
    expect(this.data_, 'No data. Did you remember to include strings.js?');
    const value = this.data_[id];
    expect(typeof value !== 'undefined', 'Could not find value for ' + id);
    return value;
  }
  getString(id) {
    const value = this.getValue(id);
    expectIsType(id, value, 'string');
    return (value);
  }
  getStringF(id, var_args) {
    const value = this.getString(id);
    if (!value) {
      return '';
    }
    const args = Array.prototype.slice.call(arguments);
    args[0] = value;
    return this.substituteString.apply(this, args);
  }
  substituteString(label, var_args) {
    const varArgs = arguments;
    return label.replace(/\$(.|$|\n)/g, function (m) {
      expect(m.match(/\$[$1-9]/), 'Unescaped $ found in localized string.');
      return m === '$$' ? '$' : varArgs[m[1]];
    });
  }
  getBoolean(id) {
    const value = this.getValue(id);
    expectIsType(id, value, 'boolean');
    return (value);
  }
  getInteger(id) {
    const value = this.getValue(id);
    expectIsType(id, value, 'number');
    expect(value === Math.floor(value), 'Number isn\'t integer: ' + value);
    return (value);
  }
  overrideValues(replacements) {
    expect(typeof replacements === 'object', 'Replacements must be a dictionary object.');
    for (const key in replacements) {
      this.data_[key] = replacements[key];
    }
  }
}

function expect(condition, message) {
  if (!condition) {
    throw new Error('Unexpected condition on ' + document.location.href + ': ' + message);
  }
}

function expectIsType(id, value, type) {
  expect(typeof value === type, '[' + value + '] (' + id + ') is not a ' + type);
}
expect(!loadTimeData, 'should only include this file once');
loadTimeData = new LoadTimeData();
window.loadTimeData = loadTimeData;
console.warn('crbug/1173575, non-JS module files deprecated.');
loadTimeData.data = {
  "billing": false,
  "closeDetails": "詳細を非表示",
  "displayEnhancedProtectionMessage": false,
  "displaycheckbox": false,
  "enhancedProtectionMessage": "Chrome の最高レベルのセキュリティで保護するには、<a href=\"#\" id=\"enhanced-protection-link\">保護強化機能を有効にしてください</a>。",
  "explanationParagraph": "korenanda.co.jp では最近、Google セーフ ブラウジングにより、<a href=\"#\" id=\"diagnostic-link\">フィッシング行為が検出されました</a>。フィッシング サイトは、他のウェブサイトになりすましてユーザーを欺こうとするサイトです。",
  "finalParagraph": "<a href=\"#\" id=\"report-error-link\">検出の問題をご報告</a>ください。<a href=\"#\" id=\"proceed-link\">安全でないこのサイトにアクセス</a>する場合は、セキュリティ上のリスクがあることをご承知おきください。",
  "fontfamily": "'Segoe UI',Arial,Meiryo,sans-serif",
  "fontsize": "75%",
  "heading": "偽のサイトにアクセスしようとしています",
  "hide_primary_button": false,
  "language": "ja",
  "openDetails": "詳細",
  "optInLink": "<a href=\"#\" id=\"whitepaper-link\">アクセスしたページの URL、システム情報、およびページのコンテンツの一部</a>を Google に送信して、ウェブ全体のセキュリティ強化にご協力ください。<a id=\"privacy-link\" href=\"#\">プライバシー ポリシー</a>",
  "overridable": true,
  "phishing": true,
  "primaryButtonText": "セキュリティで保護されたページに戻る",
  "primaryParagraph": "<strong>korenanda.co.jp</strong> では、悪意のあるユーザーによって、ソフトウェアのインストールや個人情報（パスワード、電話番号、クレジット カードなど）の入力といった危険な操作を行うよう誘導される可能性があります。<a href=\"#\" id=\"learn-more-link\">詳細</a>",
  "recurrentErrorParagraph": "",
  "show_recurrent_error_paragraph": false,
  "tabTitle": "セキュリティ エラー",
  "textdirection": "ltr",
  "type": "SAFEBROWSING"
};