/**
 * Canonical list of Nepal's 77 districts with province and centroid coordinates.
 * Centroids are derived from the simplified district boundary GeoJSON
 * (nepal-districts.geo.json) so markers stay aligned with the rendered map.
 * The district `name` is the stable key used by the API and admin panel.
 */

export type NepalDistrict = {
  name: string;
  province: number;
  lat: number;
  lng: number;
};

export const PROVINCE_NAMES: Record<number, string> = {
  1: "Koshi",
  2: "Madhesh",
  3: "Bagmati",
  4: "Gandaki",
  5: "Lumbini",
  6: "Karnali",
  7: "Sudurpashchim",
};

export const NEPAL_DISTRICTS: NepalDistrict[] = [
  { name: "Bhojpur", province: 1, lat: 27.175, lng: 87.0852 },
  { name: "Dhankuta", province: 1, lat: 27.0183, lng: 87.3642 },
  { name: "Ilam", province: 1, lat: 26.8855, lng: 87.8922 },
  { name: "Jhapa", province: 1, lat: 26.5836, lng: 87.9118 },
  { name: "Khotang", province: 1, lat: 27.1562, lng: 86.7058 },
  { name: "Morang", province: 1, lat: 26.6107, lng: 87.4648 },
  { name: "Okhaldhunga", province: 1, lat: 27.3365, lng: 86.4449 },
  { name: "Panchthar", province: 1, lat: 27.1491, lng: 87.7864 },
  { name: "Sankhuwasabha", province: 1, lat: 27.5471, lng: 87.3088 },
  { name: "Solukhumbu", province: 1, lat: 27.7256, lng: 86.6829 },
  { name: "Sunsari", province: 1, lat: 26.641, lng: 87.129 },
  { name: "Taplejung", province: 1, lat: 27.6106, lng: 87.8231 },
  { name: "Terhathum", province: 1, lat: 27.1326, lng: 87.5718 },
  { name: "Udayapur", province: 1, lat: 26.9331, lng: 86.6623 },
  { name: "Bara", province: 2, lat: 27.1075, lng: 85.0686 },
  { name: "Dhanusha", province: 2, lat: 26.8512, lng: 86.054 },
  { name: "Mahottari", province: 2, lat: 26.885, lng: 85.8108 },
  { name: "Parsa", province: 2, lat: 27.2235, lng: 84.7285 },
  { name: "Rautahat", province: 2, lat: 26.9888, lng: 85.3336 },
  { name: "Saptari", province: 2, lat: 26.6067, lng: 86.7503 },
  { name: "Sarlahi", province: 2, lat: 26.9684, lng: 85.5689 },
  { name: "Siraha", province: 2, lat: 26.7426, lng: 86.3428 },
  { name: "Bhaktapur", province: 3, lat: 27.6743, lng: 85.4386 },
  { name: "Chitawan", province: 3, lat: 27.6178, lng: 84.3577 },
  { name: "Dhading", province: 3, lat: 28.0077, lng: 84.9443 },
  { name: "Dolakha", province: 3, lat: 27.8241, lng: 86.2196 },
  { name: "Kabhrepalanchok", province: 3, lat: 27.5453, lng: 85.634 },
  { name: "Kathmandu", province: 3, lat: 27.6941, lng: 85.3772 },
  { name: "Lalitpur", province: 3, lat: 27.5483, lng: 85.3375 },
  { name: "Makawanpur", province: 3, lat: 27.4371, lng: 85.0876 },
  { name: "Nuwakot", province: 3, lat: 27.926, lng: 85.2428 },
  { name: "Ramechhap", province: 3, lat: 27.5374, lng: 86.1851 },
  { name: "Rasuwa", province: 3, lat: 28.1757, lng: 85.4613 },
  { name: "Sindhuli", province: 3, lat: 27.1851, lng: 85.904 },
  { name: "Sindhupalchok", province: 3, lat: 27.907, lng: 85.7534 },
  { name: "Baglung", province: 4, lat: 28.3564, lng: 83.276 },
  { name: "Gorkha", province: 4, lat: 28.2739, lng: 84.8084 },
  { name: "Kaski", province: 4, lat: 28.3456, lng: 83.9897 },
  { name: "Lamjung", province: 4, lat: 28.2829, lng: 84.4408 },
  { name: "Manang", province: 4, lat: 28.6727, lng: 84.1799 },
  { name: "Mustang", province: 4, lat: 28.948, lng: 83.8638 },
  { name: "Myagdi", province: 4, lat: 28.546, lng: 83.4858 },
  { name: "Nawalparasi East", province: 4, lat: 27.6538, lng: 84.0542 },
  { name: "Parbat", province: 4, lat: 28.2026, lng: 83.691 },
  { name: "Syangja", province: 4, lat: 28.045, lng: 83.7359 },
  { name: "Tanahu", province: 4, lat: 27.9355, lng: 84.2477 },
  { name: "Arghakhanchi", province: 5, lat: 27.9322, lng: 83.0394 },
  { name: "Banke", province: 5, lat: 28.0958, lng: 81.8464 },
  { name: "Bardiya", province: 5, lat: 28.3718, lng: 81.413 },
  { name: "Dang", province: 5, lat: 27.9678, lng: 82.4089 },
  { name: "Gulmi", province: 5, lat: 28.0958, lng: 83.3136 },
  { name: "Kapilbastu", province: 5, lat: 27.6193, lng: 82.9646 },
  { name: "Nawalparasi West", province: 5, lat: 27.52, lng: 83.7391 },
  { name: "Palpa", province: 5, lat: 27.8105, lng: 83.6298 },
  { name: "Pyuthan", province: 5, lat: 28.1202, lng: 82.8429 },
  { name: "Rolpa", province: 5, lat: 28.3256, lng: 82.6535 },
  { name: "Rukum East", province: 5, lat: 28.6724, lng: 82.8192 },
  { name: "Rupandehi", province: 5, lat: 27.5492, lng: 83.4191 },
  { name: "Dailekh", province: 6, lat: 28.8847, lng: 81.6685 },
  { name: "Dolpa", province: 6, lat: 29.2142, lng: 83.0363 },
  { name: "Humla", province: 6, lat: 30.0261, lng: 81.8769 },
  { name: "Jajarkot", province: 6, lat: 28.8694, lng: 82.2001 },
  { name: "Jumla", province: 6, lat: 29.2387, lng: 82.2188 },
  { name: "Kalikot", province: 6, lat: 29.2163, lng: 81.7437 },
  { name: "Mugu", province: 6, lat: 29.6783, lng: 82.2957 },
  { name: "Rukum West", province: 6, lat: 28.7565, lng: 82.4425 },
  { name: "Salyan", province: 6, lat: 28.3979, lng: 82.0904 },
  { name: "Surkhet", province: 6, lat: 28.6578, lng: 81.5108 },
  { name: "Achham", province: 7, lat: 29.0675, lng: 81.3043 },
  { name: "Baitadi", province: 7, lat: 29.5082, lng: 80.575 },
  { name: "Bajhang", province: 7, lat: 29.7226, lng: 81.1555 },
  { name: "Bajura", province: 7, lat: 29.6106, lng: 81.4891 },
  { name: "Dadeldhura", province: 7, lat: 29.2092, lng: 80.4852 },
  { name: "Darchula", province: 7, lat: 29.9259, lng: 80.7365 },
  { name: "Doti", province: 7, lat: 29.1882, lng: 80.8566 },
  { name: "Kailali", province: 7, lat: 28.7313, lng: 80.8781 },
  { name: "Kanchanpur", province: 7, lat: 28.8446, lng: 80.3091 },
];

export const NEPAL_DISTRICT_NAMES = NEPAL_DISTRICTS.map((district) => district.name);

export function getDistrictByName(name: string): NepalDistrict | undefined {
  return NEPAL_DISTRICTS.find((district) => district.name === name);
}
