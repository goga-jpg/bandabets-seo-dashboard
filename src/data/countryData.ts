/**
 * Per-country daily data for GSC and GA4.
 * Mar 14 (Fri) → Apr 12 (Sat) — 30 days
 *
 * Weekend pattern in this dataset (high betting activity):
 * idx 0=Fri,1=Sat,2=Sun, 3=Mon,4=Tue,5=Wed,6=Thu,
 *     7=Fri,8=Sat,9=Sun,10=Mon,11=Tue,12=Wed,13=Thu,
 *    14=Fri,15=Sat,16=Sun,17=Mon,18=Tue,19=Wed,20=Thu,
 *    21=Fri,22=Sat,23=Sun,24=Mon,25=Tue,26=Wed,27=Thu,
 *    28=Fri,29=Sat
 */

export interface CountryDailyGSC {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface CountryDailyGA4 {
  date: string
  sessions: number
  users: number
  newUsers: number
  conversions: number
  bounceRate: number
}

const DATES = [
  'Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20',
  'Mar 21','Mar 22','Mar 23','Mar 24','Mar 25','Mar 26','Mar 27',
  'Mar 28','Mar 29','Mar 30','Mar 31','Apr 01','Apr 02','Apr 03',
  'Apr 04','Apr 05','Apr 06','Apr 07','Apr 08','Apr 09','Apr 10',
  'Apr 11','Apr 12',
]

// ── NIGERIA ──────────────────────────────────────────────────────────────────
// Football-mad, strong Fri-Sun spikes, growing through the month
const nigeriaGSC: CountryDailyGSC[] = [
  { date:'Mar 14', clicks:  620, impressions: 14200, ctr: 4.37, position: 13.4 },
  { date:'Mar 15', clicks:  780, impressions: 17400, ctr: 4.48, position: 13.2 },
  { date:'Mar 16', clicks:  740, impressions: 16800, ctr: 4.40, position: 13.5 },
  { date:'Mar 17', clicks:  360, impressions:  8600, ctr: 4.19, position: 14.2 },
  { date:'Mar 18', clicks:  310, impressions:  7400, ctr: 4.19, position: 14.4 },
  { date:'Mar 19', clicks:  680, impressions: 15600, ctr: 4.36, position: 13.6 },
  { date:'Mar 20', clicks:  720, impressions: 16400, ctr: 4.39, position: 13.4 },
  { date:'Mar 21', clicks:  700, impressions: 15800, ctr: 4.43, position: 13.3 },
  { date:'Mar 22', clicks:  660, impressions: 15200, ctr: 4.34, position: 13.5 },
  { date:'Mar 23', clicks:  640, impressions: 14800, ctr: 4.32, position: 13.7 },
  { date:'Mar 24', clicks:  380, impressions:  9200, ctr: 4.13, position: 14.1 },
  { date:'Mar 25', clicks:  340, impressions:  8400, ctr: 4.05, position: 14.3 },
  { date:'Mar 26', clicks:  760, impressions: 17200, ctr: 4.42, position: 13.2 },
  { date:'Mar 27', clicks:  800, impressions: 18000, ctr: 4.44, position: 13.0 },
  { date:'Mar 28', clicks:  780, impressions: 17600, ctr: 4.43, position: 13.1 },
  { date:'Mar 29', clicks:  820, impressions: 18400, ctr: 4.46, position: 12.9 },
  { date:'Mar 30', clicks:  760, impressions: 17200, ctr: 4.42, position: 13.1 },
  { date:'Mar 31', clicks:  440, impressions: 10400, ctr: 4.23, position: 13.8 },
  { date:'Apr 01', clicks:  400, impressions:  9600, ctr: 4.17, position: 14.0 },
  { date:'Apr 02', clicks:  840, impressions: 18800, ctr: 4.47, position: 12.8 },
  { date:'Apr 03', clicks:  880, impressions: 19600, ctr: 4.49, position: 12.6 },
  { date:'Apr 04', clicks:  860, impressions: 19200, ctr: 4.48, position: 12.7 },
  { date:'Apr 05', clicks:  900, impressions: 20000, ctr: 4.50, position: 12.5 },
  { date:'Apr 06', clicks:  840, impressions: 18800, ctr: 4.47, position: 12.7 },
  { date:'Apr 07', clicks:  480, impressions: 11200, ctr: 4.29, position: 13.4 },
  { date:'Apr 08', clicks:  440, impressions: 10400, ctr: 4.23, position: 13.6 },
  { date:'Apr 09', clicks:  920, impressions: 20400, ctr: 4.51, position: 12.4 },
  { date:'Apr 10', clicks:  960, impressions: 21200, ctr: 4.53, position: 12.2 },
  { date:'Apr 11', clicks:  940, impressions: 20800, ctr: 4.52, position: 12.3 },
  { date:'Apr 12', clicks:  980, impressions: 21600, ctr: 4.54, position: 12.1 },
]

const nigeriaGA4: CountryDailyGA4[] = [
  { date:'Mar 14', sessions:1680, users:1380, newUsers:1040, conversions:110, bounceRate:38.4 },
  { date:'Mar 15', sessions:2080, users:1680, newUsers:1280, conversions:136, bounceRate:36.8 },
  { date:'Mar 16', sessions:1960, users:1600, newUsers:1200, conversions:128, bounceRate:37.2 },
  { date:'Mar 17', sessions: 980, users: 800, newUsers: 600, conversions: 64, bounceRate:41.6 },
  { date:'Mar 18', sessions: 900, users: 740, newUsers: 560, conversions: 59, bounceRate:42.4 },
  { date:'Mar 19', sessions:1880, users:1540, newUsers:1160, conversions:123, bounceRate:37.6 },
  { date:'Mar 20', sessions:1960, users:1600, newUsers:1200, conversions:128, bounceRate:37.2 },
  { date:'Mar 21', sessions:1920, users:1560, newUsers:1180, conversions:126, bounceRate:37.4 },
  { date:'Mar 22', sessions:1840, users:1500, newUsers:1130, conversions:120, bounceRate:37.8 },
  { date:'Mar 23', sessions:1800, users:1460, newUsers:1100, conversions:118, bounceRate:38.0 },
  { date:'Mar 24', sessions:1040, users: 860, newUsers: 640, conversions: 68, bounceRate:41.2 },
  { date:'Mar 25', sessions: 960, users: 780, newUsers: 590, conversions: 63, bounceRate:42.0 },
  { date:'Mar 26', sessions:2040, users:1660, newUsers:1250, conversions:133, bounceRate:36.6 },
  { date:'Mar 27', sessions:2120, users:1720, newUsers:1300, conversions:138, bounceRate:36.2 },
  { date:'Mar 28', sessions:2080, users:1680, newUsers:1270, conversions:136, bounceRate:36.4 },
  { date:'Mar 29', sessions:2160, users:1760, newUsers:1320, conversions:141, bounceRate:36.0 },
  { date:'Mar 30', sessions:2040, users:1660, newUsers:1250, conversions:133, bounceRate:36.4 },
  { date:'Mar 31', sessions:1180, users: 960, newUsers: 720, conversions: 77, bounceRate:40.4 },
  { date:'Apr 01', sessions:1080, users: 880, newUsers: 660, conversions: 71, bounceRate:41.0 },
  { date:'Apr 02', sessions:2200, users:1780, newUsers:1340, conversions:144, bounceRate:35.6 },
  { date:'Apr 03', sessions:2280, users:1840, newUsers:1390, conversions:149, bounceRate:35.2 },
  { date:'Apr 04', sessions:2240, users:1810, newUsers:1360, conversions:146, bounceRate:35.4 },
  { date:'Apr 05', sessions:2320, users:1880, newUsers:1410, conversions:152, bounceRate:35.0 },
  { date:'Apr 06', sessions:2200, users:1780, newUsers:1340, conversions:144, bounceRate:35.4 },
  { date:'Apr 07', sessions:1280, users:1040, newUsers: 780, conversions: 84, bounceRate:40.0 },
  { date:'Apr 08', sessions:1180, users: 960, newUsers: 720, conversions: 77, bounceRate:40.6 },
  { date:'Apr 09', sessions:2360, users:1910, newUsers:1440, conversions:154, bounceRate:34.8 },
  { date:'Apr 10', sessions:2440, users:1970, newUsers:1490, conversions:160, bounceRate:34.4 },
  { date:'Apr 11', sessions:2400, users:1940, newUsers:1460, conversions:157, bounceRate:34.6 },
  { date:'Apr 12', sessions:2480, users:2000, newUsers:1510, conversions:162, bounceRate:34.2 },
]

// ── KENYA ─────────────────────────────────────────────────────────────────────
// More consistent; cricket + football; evening peak; mobile dominant
const kenyaGSC: CountryDailyGSC[] = [
  { date:'Mar 14', clicks: 420, impressions: 10200, ctr: 4.12, position: 14.2 },
  { date:'Mar 15', clicks: 520, impressions: 12400, ctr: 4.19, position: 14.0 },
  { date:'Mar 16', clicks: 500, impressions: 11800, ctr: 4.24, position: 14.1 },
  { date:'Mar 17', clicks: 280, impressions:  7000, ctr: 4.00, position: 14.8 },
  { date:'Mar 18', clicks: 260, impressions:  6400, ctr: 4.06, position: 15.0 },
  { date:'Mar 19', clicks: 480, impressions: 11400, ctr: 4.21, position: 14.2 },
  { date:'Mar 20', clicks: 500, impressions: 11800, ctr: 4.24, position: 14.0 },
  { date:'Mar 21', clicks: 490, impressions: 11600, ctr: 4.22, position: 14.1 },
  { date:'Mar 22', clicks: 465, impressions: 11000, ctr: 4.23, position: 14.2 },
  { date:'Mar 23', clicks: 450, impressions: 10600, ctr: 4.25, position: 14.3 },
  { date:'Mar 24', clicks: 300, impressions:  7400, ctr: 4.05, position: 14.6 },
  { date:'Mar 25', clicks: 275, impressions:  6800, ctr: 4.04, position: 14.8 },
  { date:'Mar 26', clicks: 530, impressions: 12600, ctr: 4.21, position: 13.9 },
  { date:'Mar 27', clicks: 550, impressions: 13000, ctr: 4.23, position: 13.7 },
  { date:'Mar 28', clicks: 540, impressions: 12800, ctr: 4.22, position: 13.8 },
  { date:'Mar 29', clicks: 560, impressions: 13200, ctr: 4.24, position: 13.6 },
  { date:'Mar 30', clicks: 530, impressions: 12600, ctr: 4.21, position: 13.8 },
  { date:'Mar 31', clicks: 320, impressions:  7800, ctr: 4.10, position: 14.4 },
  { date:'Apr 01', clicks: 295, impressions:  7200, ctr: 4.10, position: 14.6 },
  { date:'Apr 02', clicks: 575, impressions: 13600, ctr: 4.23, position: 13.5 },
  { date:'Apr 03', clicks: 595, impressions: 14000, ctr: 4.25, position: 13.3 },
  { date:'Apr 04', clicks: 585, impressions: 13800, ctr: 4.24, position: 13.4 },
  { date:'Apr 05', clicks: 610, impressions: 14400, ctr: 4.24, position: 13.2 },
  { date:'Apr 06', clicks: 575, impressions: 13600, ctr: 4.23, position: 13.4 },
  { date:'Apr 07', clicks: 340, impressions:  8200, ctr: 4.15, position: 14.1 },
  { date:'Apr 08', clicks: 315, impressions:  7600, ctr: 4.14, position: 14.3 },
  { date:'Apr 09', clicks: 625, impressions: 14800, ctr: 4.22, position: 13.1 },
  { date:'Apr 10', clicks: 645, impressions: 15200, ctr: 4.24, position: 12.9 },
  { date:'Apr 11', clicks: 635, impressions: 15000, ctr: 4.23, position: 13.0 },
  { date:'Apr 12', clicks: 655, impressions: 15400, ctr: 4.25, position: 12.8 },
]

const kenyaGA4: CountryDailyGA4[] = [
  { date:'Mar 14', sessions:1120, users: 920, newUsers: 690, conversions: 73, bounceRate:39.2 },
  { date:'Mar 15', sessions:1380, users:1130, newUsers: 850, conversions: 90, bounceRate:37.8 },
  { date:'Mar 16', sessions:1320, users:1080, newUsers: 810, conversions: 86, bounceRate:38.2 },
  { date:'Mar 17', sessions: 720, users: 590, newUsers: 440, conversions: 47, bounceRate:42.4 },
  { date:'Mar 18', sessions: 660, users: 540, newUsers: 410, conversions: 43, bounceRate:43.2 },
  { date:'Mar 19', sessions:1260, users:1030, newUsers: 780, conversions: 82, bounceRate:38.4 },
  { date:'Mar 20', sessions:1320, users:1080, newUsers: 810, conversions: 86, bounceRate:38.0 },
  { date:'Mar 21', sessions:1290, users:1055, newUsers: 795, conversions: 84, bounceRate:38.2 },
  { date:'Mar 22', sessions:1230, users:1005, newUsers: 755, conversions: 80, bounceRate:38.6 },
  { date:'Mar 23', sessions:1200, users: 980, newUsers: 740, conversions: 78, bounceRate:38.8 },
  { date:'Mar 24', sessions: 780, users: 640, newUsers: 480, conversions: 51, bounceRate:42.0 },
  { date:'Mar 25', sessions: 720, users: 590, newUsers: 440, conversions: 47, bounceRate:42.8 },
  { date:'Mar 26', sessions:1380, users:1130, newUsers: 850, conversions: 90, bounceRate:37.4 },
  { date:'Mar 27', sessions:1440, users:1175, newUsers: 885, conversions: 94, bounceRate:37.0 },
  { date:'Mar 28', sessions:1410, users:1150, newUsers: 868, conversions: 92, bounceRate:37.2 },
  { date:'Mar 29', sessions:1470, users:1200, newUsers: 900, conversions: 96, bounceRate:36.8 },
  { date:'Mar 30', sessions:1380, users:1130, newUsers: 850, conversions: 90, bounceRate:37.2 },
  { date:'Mar 31', sessions: 840, users: 690, newUsers: 520, conversions: 55, bounceRate:41.4 },
  { date:'Apr 01', sessions: 780, users: 640, newUsers: 480, conversions: 51, bounceRate:42.0 },
  { date:'Apr 02', sessions:1500, users:1225, newUsers: 920, conversions: 98, bounceRate:36.4 },
  { date:'Apr 03', sessions:1560, users:1270, newUsers: 955, conversions:102, bounceRate:36.0 },
  { date:'Apr 04', sessions:1530, users:1248, newUsers: 938, conversions:100, bounceRate:36.2 },
  { date:'Apr 05', sessions:1590, users:1295, newUsers: 970, conversions:104, bounceRate:35.8 },
  { date:'Apr 06', sessions:1500, users:1225, newUsers: 920, conversions: 98, bounceRate:36.2 },
  { date:'Apr 07', sessions: 900, users: 736, newUsers: 553, conversions: 59, bounceRate:41.0 },
  { date:'Apr 08', sessions: 840, users: 690, newUsers: 518, conversions: 55, bounceRate:41.6 },
  { date:'Apr 09', sessions:1620, users:1320, newUsers: 990, conversions:106, bounceRate:35.6 },
  { date:'Apr 10', sessions:1680, users:1370, newUsers:1028, conversions:110, bounceRate:35.2 },
  { date:'Apr 11', sessions:1650, users:1345, newUsers:1010, conversions:108, bounceRate:35.4 },
  { date:'Apr 12', sessions:1710, users:1395, newUsers:1046, conversions:112, bounceRate:35.0 },
]

// ── UGANDA ────────────────────────────────────────────────────────────────────
// Rapidly growing, steeper upward trend, mobile-first
const ugandaGSC: CountryDailyGSC[] = [
  { date:'Mar 14', clicks: 280, impressions:  7200, ctr: 3.89, position: 15.2 },
  { date:'Mar 15', clicks: 360, impressions:  8800, ctr: 4.09, position: 14.8 },
  { date:'Mar 16', clicks: 340, impressions:  8400, ctr: 4.05, position: 14.9 },
  { date:'Mar 17', clicks: 180, impressions:  5000, ctr: 3.60, position: 15.8 },
  { date:'Mar 18', clicks: 165, impressions:  4600, ctr: 3.59, position: 16.0 },
  { date:'Mar 19', clicks: 320, impressions:  7800, ctr: 4.10, position: 15.0 },
  { date:'Mar 20', clicks: 340, impressions:  8200, ctr: 4.15, position: 14.8 },
  { date:'Mar 21', clicks: 330, impressions:  8000, ctr: 4.13, position: 14.9 },
  { date:'Mar 22', clicks: 315, impressions:  7600, ctr: 4.14, position: 15.0 },
  { date:'Mar 23', clicks: 300, impressions:  7200, ctr: 4.17, position: 15.1 },
  { date:'Mar 24', clicks: 200, impressions:  5400, ctr: 3.70, position: 15.5 },
  { date:'Mar 25', clicks: 185, impressions:  5000, ctr: 3.70, position: 15.7 },
  { date:'Mar 26', clicks: 360, impressions:  8600, ctr: 4.19, position: 14.6 },
  { date:'Mar 27', clicks: 380, impressions:  9000, ctr: 4.22, position: 14.4 },
  { date:'Mar 28', clicks: 370, impressions:  8800, ctr: 4.20, position: 14.5 },
  { date:'Mar 29', clicks: 390, impressions:  9200, ctr: 4.24, position: 14.2 },
  { date:'Mar 30', clicks: 370, impressions:  8800, ctr: 4.20, position: 14.4 },
  { date:'Mar 31', clicks: 230, impressions:  6000, ctr: 3.83, position: 15.1 },
  { date:'Apr 01', clicks: 210, impressions:  5600, ctr: 3.75, position: 15.3 },
  { date:'Apr 02', clicks: 410, impressions:  9600, ctr: 4.27, position: 14.0 },
  { date:'Apr 03', clicks: 430, impressions: 10000, ctr: 4.30, position: 13.8 },
  { date:'Apr 04', clicks: 420, impressions:  9800, ctr: 4.29, position: 13.9 },
  { date:'Apr 05', clicks: 450, impressions: 10400, ctr: 4.33, position: 13.6 },
  { date:'Apr 06', clicks: 420, impressions:  9800, ctr: 4.29, position: 13.8 },
  { date:'Apr 07', clicks: 255, impressions:  6400, ctr: 3.98, position: 14.7 },
  { date:'Apr 08', clicks: 235, impressions:  5800, ctr: 4.05, position: 14.9 },
  { date:'Apr 09', clicks: 470, impressions: 10800, ctr: 4.35, position: 13.4 },
  { date:'Apr 10', clicks: 490, impressions: 11200, ctr: 4.38, position: 13.2 },
  { date:'Apr 11', clicks: 480, impressions: 11000, ctr: 4.36, position: 13.3 },
  { date:'Apr 12', clicks: 500, impressions: 11400, ctr: 4.39, position: 13.1 },
]

const ugandaGA4: CountryDailyGA4[] = [
  { date:'Mar 14', sessions: 840, users: 690, newUsers: 518, conversions: 55, bounceRate:40.2 },
  { date:'Mar 15', sessions:1040, users: 850, newUsers: 640, conversions: 68, bounceRate:38.8 },
  { date:'Mar 16', sessions: 990, users: 810, newUsers: 610, conversions: 65, bounceRate:39.2 },
  { date:'Mar 17', sessions: 520, users: 430, newUsers: 320, conversions: 34, bounceRate:43.4 },
  { date:'Mar 18', sessions: 480, users: 395, newUsers: 296, conversions: 31, bounceRate:44.2 },
  { date:'Mar 19', sessions: 940, users: 770, newUsers: 578, conversions: 61, bounceRate:39.4 },
  { date:'Mar 20', sessions: 990, users: 810, newUsers: 610, conversions: 65, bounceRate:39.0 },
  { date:'Mar 21', sessions: 965, users: 790, newUsers: 594, conversions: 63, bounceRate:39.2 },
  { date:'Mar 22', sessions: 920, users: 755, newUsers: 566, conversions: 60, bounceRate:39.6 },
  { date:'Mar 23', sessions: 890, users: 728, newUsers: 548, conversions: 58, bounceRate:39.8 },
  { date:'Mar 24', sessions: 580, users: 475, newUsers: 357, conversions: 38, bounceRate:43.0 },
  { date:'Mar 25', sessions: 530, users: 435, newUsers: 326, conversions: 35, bounceRate:43.8 },
  { date:'Mar 26', sessions:1040, users: 852, newUsers: 640, conversions: 68, bounceRate:38.4 },
  { date:'Mar 27', sessions:1090, users: 890, newUsers: 670, conversions: 71, bounceRate:38.0 },
  { date:'Mar 28', sessions:1065, users: 871, newUsers: 655, conversions: 70, bounceRate:38.2 },
  { date:'Mar 29', sessions:1115, users: 912, newUsers: 685, conversions: 73, bounceRate:37.8 },
  { date:'Mar 30', sessions:1040, users: 852, newUsers: 640, conversions: 68, bounceRate:38.2 },
  { date:'Mar 31', sessions: 630, users: 516, newUsers: 388, conversions: 41, bounceRate:42.4 },
  { date:'Apr 01', sessions: 580, users: 475, newUsers: 357, conversions: 38, bounceRate:43.0 },
  { date:'Apr 02', sessions:1140, users: 933, newUsers: 700, conversions: 74, bounceRate:37.4 },
  { date:'Apr 03', sessions:1190, users: 975, newUsers: 732, conversions: 78, bounceRate:37.0 },
  { date:'Apr 04', sessions:1165, users: 954, newUsers: 716, conversions: 76, bounceRate:37.2 },
  { date:'Apr 05', sessions:1215, users: 995, newUsers: 746, conversions: 79, bounceRate:36.8 },
  { date:'Apr 06', sessions:1140, users: 933, newUsers: 700, conversions: 74, bounceRate:37.2 },
  { date:'Apr 07', sessions: 680, users: 558, newUsers: 418, conversions: 44, bounceRate:42.0 },
  { date:'Apr 08', sessions: 625, users: 513, newUsers: 384, conversions: 41, bounceRate:42.6 },
  { date:'Apr 09', sessions:1240, users:1015, newUsers: 762, conversions: 81, bounceRate:36.6 },
  { date:'Apr 10', sessions:1290, users:1057, newUsers: 793, conversions: 84, bounceRate:36.2 },
  { date:'Apr 11', sessions:1265, users:1036, newUsers: 777, conversions: 83, bounceRate:36.4 },
  { date:'Apr 12', sessions:1315, users:1077, newUsers: 808, conversions: 86, bounceRate:36.0 },
]

// ── CONGO (DRC) ───────────────────────────────────────────────────────────────
// French-speaking, weekend-heavy, growing fast, slightly lower CTR
const congoGSC: CountryDailyGSC[] = [
  { date:'Mar 14', clicks: 195, impressions:  5400, ctr: 3.61, position: 15.8 },
  { date:'Mar 15', clicks: 280, impressions:  7200, ctr: 3.89, position: 15.4 },
  { date:'Mar 16', clicks: 265, impressions:  6800, ctr: 3.90, position: 15.5 },
  { date:'Mar 17', clicks: 125, impressions:  3800, ctr: 3.29, position: 16.4 },
  { date:'Mar 18', clicks: 112, impressions:  3400, ctr: 3.29, position: 16.6 },
  { date:'Mar 19', clicks: 235, impressions:  6200, ctr: 3.79, position: 15.6 },
  { date:'Mar 20', clicks: 252, impressions:  6600, ctr: 3.82, position: 15.4 },
  { date:'Mar 21', clicks: 245, impressions:  6400, ctr: 3.83, position: 15.5 },
  { date:'Mar 22', clicks: 232, impressions:  6100, ctr: 3.80, position: 15.6 },
  { date:'Mar 23', clicks: 225, impressions:  5900, ctr: 3.81, position: 15.7 },
  { date:'Mar 24', clicks: 140, impressions:  4000, ctr: 3.50, position: 16.1 },
  { date:'Mar 25', clicks: 128, impressions:  3700, ctr: 3.46, position: 16.3 },
  { date:'Mar 26', clicks: 268, impressions:  6900, ctr: 3.88, position: 15.2 },
  { date:'Mar 27', clicks: 282, impressions:  7200, ctr: 3.92, position: 15.0 },
  { date:'Mar 28', clicks: 275, impressions:  7000, ctr: 3.93, position: 15.1 },
  { date:'Mar 29', clicks: 290, impressions:  7400, ctr: 3.92, position: 14.8 },
  { date:'Mar 30', clicks: 272, impressions:  6900, ctr: 3.94, position: 15.0 },
  { date:'Mar 31', clicks: 170, impressions:  4600, ctr: 3.70, position: 15.7 },
  { date:'Apr 01', clicks: 155, impressions:  4200, ctr: 3.69, position: 15.9 },
  { date:'Apr 02', clicks: 304, impressions:  7700, ctr: 3.95, position: 14.6 },
  { date:'Apr 03', clicks: 318, impressions:  8000, ctr: 3.98, position: 14.4 },
  { date:'Apr 04', clicks: 311, impressions:  7800, ctr: 3.99, position: 14.5 },
  { date:'Apr 05', clicks: 328, impressions:  8200, ctr: 4.00, position: 14.2 },
  { date:'Apr 06', clicks: 308, impressions:  7700, ctr: 4.00, position: 14.4 },
  { date:'Apr 07', clicks: 188, impressions:  5000, ctr: 3.76, position: 15.3 },
  { date:'Apr 08', clicks: 172, impressions:  4600, ctr: 3.74, position: 15.5 },
  { date:'Apr 09', clicks: 342, impressions:  8500, ctr: 4.02, position: 14.0 },
  { date:'Apr 10', clicks: 356, impressions:  8800, ctr: 4.05, position: 13.8 },
  { date:'Apr 11', clicks: 349, impressions:  8600, ctr: 4.06, position: 13.9 },
  { date:'Apr 12', clicks: 364, impressions:  9000, ctr: 4.04, position: 13.7 },
]

const congoGA4: CountryDailyGA4[] = [
  { date:'Mar 14', sessions: 560, users: 460, newUsers: 345, conversions: 37, bounceRate:41.4 },
  { date:'Mar 15', sessions: 760, users: 620, newUsers: 466, conversions: 50, bounceRate:39.8 },
  { date:'Mar 16', sessions: 720, users: 590, newUsers: 443, conversions: 47, bounceRate:40.2 },
  { date:'Mar 17', sessions: 360, users: 295, newUsers: 222, conversions: 24, bounceRate:44.6 },
  { date:'Mar 18', sessions: 330, users: 270, newUsers: 203, conversions: 22, bounceRate:45.4 },
  { date:'Mar 19', sessions: 660, users: 540, newUsers: 406, conversions: 43, bounceRate:40.4 },
  { date:'Mar 20', sessions: 700, users: 574, newUsers: 430, conversions: 46, bounceRate:40.0 },
  { date:'Mar 21', sessions: 680, users: 557, newUsers: 418, conversions: 44, bounceRate:40.2 },
  { date:'Mar 22', sessions: 645, users: 529, newUsers: 396, conversions: 42, bounceRate:40.6 },
  { date:'Mar 23', sessions: 625, users: 513, newUsers: 384, conversions: 41, bounceRate:40.8 },
  { date:'Mar 24', sessions: 400, users: 328, newUsers: 246, conversions: 26, bounceRate:44.2 },
  { date:'Mar 25', sessions: 365, users: 300, newUsers: 225, conversions: 24, bounceRate:44.8 },
  { date:'Mar 26', sessions: 720, users: 590, newUsers: 443, conversions: 47, bounceRate:39.4 },
  { date:'Mar 27', sessions: 760, users: 623, newUsers: 467, conversions: 50, bounceRate:39.0 },
  { date:'Mar 28', sessions: 740, users: 606, newUsers: 455, conversions: 48, bounceRate:39.2 },
  { date:'Mar 29', sessions: 780, users: 639, newUsers: 479, conversions: 51, bounceRate:38.8 },
  { date:'Mar 30', sessions: 725, users: 594, newUsers: 445, conversions: 47, bounceRate:39.2 },
  { date:'Mar 31', sessions: 435, users: 357, newUsers: 268, conversions: 28, bounceRate:43.4 },
  { date:'Apr 01', sessions: 400, users: 328, newUsers: 246, conversions: 26, bounceRate:44.0 },
  { date:'Apr 02', sessions: 800, users: 656, newUsers: 492, conversions: 52, bounceRate:38.4 },
  { date:'Apr 03', sessions: 840, users: 689, newUsers: 516, conversions: 55, bounceRate:38.0 },
  { date:'Apr 04', sessions: 820, users: 672, newUsers: 504, conversions: 54, bounceRate:38.2 },
  { date:'Apr 05', sessions: 860, users: 705, newUsers: 528, conversions: 56, bounceRate:37.8 },
  { date:'Apr 06', sessions: 800, users: 656, newUsers: 492, conversions: 52, bounceRate:38.2 },
  { date:'Apr 07', sessions: 470, users: 386, newUsers: 289, conversions: 31, bounceRate:43.0 },
  { date:'Apr 08', sessions: 430, users: 353, newUsers: 264, conversions: 28, bounceRate:43.6 },
  { date:'Apr 09', sessions: 880, users: 721, newUsers: 541, conversions: 57, bounceRate:37.6 },
  { date:'Apr 10', sessions: 920, users: 754, newUsers: 566, conversions: 60, bounceRate:37.2 },
  { date:'Apr 11', sessions: 900, users: 738, newUsers: 553, conversions: 59, bounceRate:37.4 },
  { date:'Apr 12', sessions: 940, users: 770, newUsers: 578, conversions: 61, bounceRate:37.0 },
]

// ── Exports ───────────────────────────────────────────────────────────────────
export const countryGSCData = {
  Nigeria: nigeriaGSC,
  Kenya:   kenyaGSC,
  Uganda:  ugandaGSC,
  Congo:   congoGSC,
}

export const countryGA4Data = {
  Nigeria: nigeriaGA4,
  Kenya:   kenyaGA4,
  Uganda:  ugandaGA4,
  Congo:   congoGA4,
}

export const countrySummaryGSC = {
  Nigeria: { totalClicks: nigeriaGSC.reduce((s,d)=>s+d.clicks,0), avgCtr: 4.38, avgPosition: 13.2 },
  Kenya:   { totalClicks: kenyaGSC.reduce((s,d)=>s+d.clicks,0),   avgCtr: 4.19, avgPosition: 13.9 },
  Uganda:  { totalClicks: ugandaGSC.reduce((s,d)=>s+d.clicks,0),  avgCtr: 4.12, avgPosition: 14.5 },
  Congo:   { totalClicks: congoGSC.reduce((s,d)=>s+d.clicks,0),   avgCtr: 3.84, avgPosition: 15.2 },
}

export const countrySummaryGA4 = {
  Nigeria: {
    totalSessions:     nigeriaGA4.reduce((s,d)=>s+d.sessions,0),
    totalUsers:        nigeriaGA4.reduce((s,d)=>s+d.users,0),
    totalConversions:  nigeriaGA4.reduce((s,d)=>s+d.conversions,0),
    avgBounceRate:     +(nigeriaGA4.reduce((s,d)=>s+d.bounceRate,0) / nigeriaGA4.length).toFixed(1),
    sessionsChange:    +18.4,
    usersChange:       +16.2,
    conversionsChange: +21.6,
    bounceRateChange:  -4.2,
  },
  Kenya: {
    totalSessions:     kenyaGA4.reduce((s,d)=>s+d.sessions,0),
    totalUsers:        kenyaGA4.reduce((s,d)=>s+d.users,0),
    totalConversions:  kenyaGA4.reduce((s,d)=>s+d.conversions,0),
    avgBounceRate:     +(kenyaGA4.reduce((s,d)=>s+d.bounceRate,0) / kenyaGA4.length).toFixed(1),
    sessionsChange:    +14.2,
    usersChange:       +12.8,
    conversionsChange: +18.6,
    bounceRateChange:  -3.8,
  },
  Uganda: {
    totalSessions:     ugandaGA4.reduce((s,d)=>s+d.sessions,0),
    totalUsers:        ugandaGA4.reduce((s,d)=>s+d.users,0),
    totalConversions:  ugandaGA4.reduce((s,d)=>s+d.conversions,0),
    avgBounceRate:     +(ugandaGA4.reduce((s,d)=>s+d.bounceRate,0) / ugandaGA4.length).toFixed(1),
    sessionsChange:    +24.8,
    usersChange:       +22.4,
    conversionsChange: +28.2,
    bounceRateChange:  -5.6,
  },
  Congo: {
    totalSessions:     congoGA4.reduce((s,d)=>s+d.sessions,0),
    totalUsers:        congoGA4.reduce((s,d)=>s+d.users,0),
    totalConversions:  congoGA4.reduce((s,d)=>s+d.conversions,0),
    avgBounceRate:     +(congoGA4.reduce((s,d)=>s+d.bounceRate,0) / congoGA4.length).toFixed(1),
    sessionsChange:    +16.4,
    usersChange:       +14.2,
    conversionsChange: +20.8,
    bounceRateChange:  -4.6,
  },
}
