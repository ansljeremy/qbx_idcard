import { fetchNui } from './fetchNui.js';
import { Global } from '../../lang/global.js';
import config from './config.js';

/**
 * Get element by id
 * @param id {string}
 **/
const getElementById = (id) => document.getElementById(id);

/**
 * Set visibility
 * @param visibility {string}
 **/
const setVisibility = (visibility) => getElementById('um-idcard').style.visibility = visibility;

/**
 * Set visibility of badge
 * @param badge {string|Object|null}
 **/
const setBadgeVisibility = (badge) => {
  const badgeElement = getElementById('badge');
  if (!badge || badge === 'none') {
    badgeElement.style.display = 'none';
    return;
  }
  getElementById('badgeimg').src = `badges/${badge.img}.png`;
  getElementById('badgegrade').textContent = badge.grade;
  badgeElement.style.display = 'flex';
};

const closeFunction = () => {
  getElementById('um-idcard').classList.remove('animate__animated', 'animate__fadeInLeft', 'animate__faster');
  setVisibility('hidden');
  setBadgeVisibility('none');
  fetchNui('closeIdCard');
};

/**
 * Open id card
 * @param playerData {Object}
 **/
const openIdCard = (playerData) => {
  const license = config.licenses[playerData.cardtype];
  const elements = {
    lastname: playerData.lastname,
    name: playerData.firstname,
    citizenid: playerData.citizenid,
    sign: `${playerData.firstname} ${playerData.lastname}`,
    dob: playerData.birthdate,
    sex: playerData.sex,
    nationality: playerData.nationality,
    cardtype: license.header,
  };

  Object.entries(elements).forEach(([key, value]) => {
    getElementById(key).textContent = value;
  });

  getElementById('mugshot').src = playerData.mugShot;
  getElementById('smallmugshot').src = playerData.mugShot;
  getElementById('um-idcard').style.backgroundImage = `url(${license.backgroundImage})`;
  getElementById('um-idcard').style.backgroundColor = license.background;
  getElementById('um-idcard').classList.add('animate__animated', 'animate__fadeInLeft', 'animate__faster');
  setBadgeVisibility(playerData.badge);
  setVisibility('visible');
  autoClose();
};

const autoClose = () => {
  if (!config.idCardSettings.autoClose.status) return;
  setTimeout(closeFunction, config.idCardSettings.autoClose.time);
};

window.addEventListener('message', (event) => {
  const { type, playerData, configData } = event.data;
  if (type === 'playerData') {
    openIdCard(playerData);
  } else if (type === 'configData') {
    Object.assign(config, configData);
  }
});

window.addEventListener('load', () => {
  Object.entries(Global).forEach(([key, value]) => {
    getElementById(key).textContent = value;
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== config.idCardSettings.closeKey) return;
  closeFunction();
});
