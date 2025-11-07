
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

type Category = 'empathy' | 'logic' | 'decision' | 'awareness';

type Answer = {
  answerText: string;
  isCorrect: boolean;
};

type Question = {
  questionText: string;
  answers: Answer[];
  category: Category;
  type?: 'text' | 'visual';
};

const allQuestions: Question[] = [
  // Empathy (15 Questions)
  { questionText: 'Parkta düşen bir arkadaşını görünce ne yaparsın?', answers: [{ answerText: 'Yardım ederim', isCorrect: true }, { answerText: 'Gülerim', isCorrect: false }, { answerText: 'Hiçbir şey yapmam', isCorrect: false }], category: 'empathy' },
  { questionText: 'Arkadaşın oyuncağını seninle paylaştığında ne dersin?', answers: [{ answerText: 'Teşekkür ederim!', isCorrect: true }, { answerText: 'O benim!', isCorrect: false }, { answerText: 'Daha güzelini al', isCorrect: false }], category: 'empathy' },
  { questionText: 'Ağlayan birini gördüğünde ne hissedersin?', answers: [{ answerText: 'Üzülürüm', isCorrect: true }, { answerText: 'Hiçbir şey', isCorrect: false }, { answerText: 'Sevinirim', isCorrect: false }], category: 'empathy' },
  { questionText: 'Oyun oynarken bir arkadaşın kenarda tek başına duruyorsa ne yaparsın?', answers: [{ answerText: 'Onu da oyuna davet ederim', isCorrect: true }, { answerText: 'Umursamam', isCorrect: false }, { answerText: 'Ona top atarım', isCorrect: false }], category: 'empathy' },
  { questionText: 'Birisinin yeni elbisesini beğendiysen ne söylersin?', answers: [{ answerText: 'Elbisen çok güzel olmuş!', isCorrect: true }, { answerText: 'Benimki daha güzel', isCorrect: false }, { answerText: 'Hiçbir şey demem', isCorrect: false }], category: 'empathy' },
  { questionText: 'Kardeşin hasta olduğunda nasıl davranırsın?', answers: [{ answerText: 'Ona çorba getiririm', isCorrect: true }, { answerText: 'Onunla dalga geçerim', isCorrect: false }, { answerText: 'Gürültü yaparım', isCorrect: false }], category: 'empathy' },
  { questionText: 'Birisi yanlışlıkla sana çarparsa ne yaparsın?', answers: [{ answerText: '"Önemli değil" derim', isCorrect: true }, { answerText: 'Ona kızarım', isCorrect: false }, { answerText: 'Ağlarım', isCorrect: false }], category: 'empathy' },
  { questionText: 'Okulda yeni bir öğrenci varsa ne yaparsın?', answers: [{ answerText: 'Onunla tanışırım', isCorrect: true }, { answerText: 'Ondan uzak dururum', isCorrect: false }, { answerText: 'Onu dışlarım', isCorrect: false }], category: 'empathy' },
  { questionText: 'Hayvanlar üzgün olabilir mi?', answers: [{ answerText: 'Evet, olabilirler', isCorrect: true }, { answerText: 'Hayır, olamazlar', isCorrect: false }, { answerText: 'Bilmiyorum', isCorrect: false }], category: 'empathy' },
  { questionText: 'Arkadaşın bir sırrını söylerse ne yaparsın?', answers: [{ answerText: 'Sırrını saklarım', isCorrect: true }, { answerText: 'Herkese söylerim', isCorrect: false }, { answerText: 'Unuturum', isCorrect: false }], category: 'empathy' },
  { questionText: 'Arkadaşın seninle oynamak istemediğini söyledi. Bu durumda ne düşünürsün?', answers: [{ answerText: 'Belki başka bir şey yapmak istiyordur, sonra yine oynarız', isCorrect: true }, { answerText: 'Beni sevmiyor', isCorrect: false }, { answerText: 'Ona çok kızarım', isCorrect: false }], category: 'empathy' },
  { questionText: 'Birisi sana yardım ettiğinde ama istemediğin bir şekilde yapsa ne dersin?', answers: [{ answerText: 'Teşekkür ederim ama bir dahakine böyle yapabiliriz', isCorrect: true }, { answerText: 'Hiçbir şey demem ve üzülürüm', isCorrect: false }, { answerText: 'Böyle yardım olmaz olsun!', isCorrect: false }], category: 'empathy' },
  { questionText: 'Yarışmada kaybeden arkadaşını teselli etmek için ne söylersin?', answers: [{ answerText: 'Harika yarıştın, denemek en önemlisi!', isCorrect: true }, { answerText: 'Ben kazandım!', isCorrect: false }, { answerText: 'Sen zaten kazanamazdın', isCorrect: false }], category: 'empathy' },
  { questionText: 'Paylaşmak neden güzeldir?', answers: [{ answerText: 'İnsanları mutlu eder ve bağları güçlendirir', isCorrect: true }, { answerText: 'Eşyalarımızı azaltır', isCorrect: false }, { answerText: 'Güzel değildir', isCorrect: false }], category: 'empathy' },
  { questionText: 'Birisi seninle alay ederse ne hissedersin?', answers: [{ answerText: 'Kırılır ve üzülürüm', isCorrect: true }, { answerText: 'Hoşuma gider', isCorrect: false }, { answerText: 'Umrumda olmaz', isCorrect: false }], category: 'empathy' },
  // Logic (15 Questions)
  { questionText: 'Kırmızı ve maviyi karıştırırsan hangi renk olur?', answers: [{ answerText: 'Mor', isCorrect: true }, { answerText: 'Yeşil', isCorrect: false }, { answerText: 'Turuncu', isCorrect: false }], category: 'logic' },
  { questionText: 'Bir hafta kaç gündür?', answers: [{ answerText: '7', isCorrect: true }, { answerText: '5', isCorrect: false }, { answerText: '10', isCorrect: false }], category: 'logic' },
  { questionText: 'Hangisi uçar? 🐦 🐶 🐟', answers: [{ answerText: 'Kuş 🐦', isCorrect: true }, { answerText: 'Köpek 🐶', isCorrect: false }, { answerText: 'Balık 🐟', isCorrect: false }], category: 'logic' },
  { questionText: 'Güneş ne zaman doğar?', answers: [{ answerText: 'Sabah', isCorrect: true }, { answerText: 'Akşam', isCorrect: false }, { answerText: 'Gece', isCorrect: false }], category: 'logic' },
  { questionText: 'Bir yılda kaç mevsim vardır?', answers: [{ answerText: '4', isCorrect: true }, { answerText: '2', isCorrect: false }, { answerText: '12', isCorrect: false }], category: 'logic' },
  { questionText: 'Buz eriyince ne olur?', answers: [{ answerText: 'Su', isCorrect: true }, { answerText: 'Buhar', isCorrect: false }, { answerText: 'Toprak', isCorrect: false }], category: 'logic' },
  { questionText: 'Resimdeki desenin sıradaki şekli hangisidir? ▲●■▲●__', answers: [{ answerText: '■', isCorrect: true }, { answerText: '▲', isCorrect: false }, { answerText: '●', isCorrect: false }], category: 'logic' },
  { questionText: 'Hangisi bir meyve değildir?', answers: [{ answerText: 'Havuç', isCorrect: true }, { answerText: 'Elma', isCorrect: false }, { answerText: 'Çilek', isCorrect: false }], category: 'logic' },
  { questionText: 'Ağaçlar bize ne verir?', answers: [{ answerText: 'Oksijen', isCorrect: true }, { answerText: 'Plastik', isCorrect: false }, { answerText: 'Taş', isCorrect: false }], category: 'logic' },
  { questionText: '3 elmam var, 2 tane daha alırsam kaç elmam olur?', answers: [{ answerText: '5', isCorrect: true }, { answerText: '4', isCorrect: false }, { answerText: '6', isCorrect: false }], category: 'logic' },
  { questionText: 'Resimdeki hayvanlardan hangisi kış uykusuna yatar? 🐻 🦊 🐇', answers: [{ answerText: 'Ayı 🐻', isCorrect: true }, { answerText: 'Tilki 🦊', isCorrect: false }, { answerText: 'Tavşan 🐇', isCorrect: false }], category: 'logic' },
  { questionText: 'Bir sepetin içinde 5 elma var. 3 arkadaşına birer tane verirsen, sepette kaç elma kalır?', answers: [{ answerText: '2', isCorrect: true }, { answerText: '5', isCorrect: false }, { answerText: '3', isCorrect: false }], category: 'logic' },
  { questionText: 'Hangisi daha yavaştır? 🐌  Cheetah 🐆', answers: [{ answerText: 'Salyangoz 🐌', isCorrect: true }, { answerText: 'Çita 🐆', isCorrect: false }, { answerText: 'İkisi de aynı hızda', isCorrect: false }], category: 'logic' },
  { questionText: 'Eğer dün Salı ise, yarın hangi gün olur?', answers: [{ answerText: 'Perşembe', isCorrect: true }, { answerText: 'Çarşamba', isCorrect: false }, { answerText: 'Cuma', isCorrect: false }], category: 'logic' },
  { questionText: 'Hangisi gökyüzünde bulunur ama bir gezegen değildir?', answers: [{ answerText: 'Ay 🌙', isCorrect: true }, { answerText: 'Mars', isCorrect: false }, { answerText: 'Ağaç 🌳', isCorrect: false }], category: 'logic' },
  // Decision (15 Questions)
  { questionText: 'Hava yağmurluysa dışarı çıkarken yanına ne alırsın?', answers: [{ answerText: 'Şemsiye ☂️', isCorrect: true }, { answerText: 'Güneş gözlüğü 😎', isCorrect: false }, { answerText: 'Uçurtma', isCorrect: false }], category: 'decision' },
  { questionText: 'Ödevini ne zaman yapmalısın?', answers: [{ answerText: 'Oyun oynamadan önce veya sonra planlayarak', isCorrect: true }, { answerText: 'Hiçbir zaman', isCorrect: false }, { answerText: 'Sabah okulda', isCorrect: false }], category: 'decision' },
  { questionText: 'Odanı toplamak kimin görevidir?', answers: [{ answerText: 'Benim', isCorrect: true }, { answerText: 'Annemin', isCorrect: false }, { answerText: 'Babamın', isCorrect: false }], category: 'decision' },
  { questionText: 'Birisi sana tanımadığın bir şey ikram ederse ne yaparsın?', answers: [{ answerText: 'Teşekkür edip almam', isCorrect: true }, { answerText: 'Hemen yerim', isCorrect: false }, { answerText: 'Ağlarım', isCorrect: false }], category: 'decision' },
  { questionText: 'Dişlerini ne zaman fırçalamalısın?', answers: [{ answerText: 'Yemeklerden sonra ve yatmadan önce', isCorrect: true }, { answerText: 'Sadece sabah', isCorrect: false }, { answerText: 'Hiç fırçalamam', isCorrect: false }], category: 'decision' },
  { questionText: 'Bir sorun yaşadığında ilk kime söylersin?', answers: [{ answerText: 'Anneme veya babama', isCorrect: true }, { answerText: 'Hiç kimseye', isCorrect: false }, { answerText: 'Arkadaşıma', isCorrect: false }], category: 'decision' },
  { questionText: 'Yolda bir cüzdan bulursan ne yaparsın?', answers: [{ answerText: 'Polise veya bir büyüğüme veririm', isCorrect: true }, { answerText: 'İçindeki parayı alırım', isCorrect: false }, { answerText: 'Hiçbir şey yapmam', isCorrect: false }], category: 'decision' },
  { questionText: 'Arkadaşınla kavga edersen ne yaparsın?', answers: [{ answerText: 'Sakinleşince konuşup özür dilerim', isCorrect: true }, { answerText: 'Ona küserim', isCorrect: false }, { answerText: 'Ona vururum', isCorrect: false }], category: 'decision' },
  { questionText: 'Sokakta kaybolursan ne yaparsın?', answers: [{ answerText: 'Güvenilir bir yetişkinden (polis, esnaf) yardım isterim', isCorrect: true }, { answerText: 'Ağlayarak koşarım', isCorrect: false }, { answerText: 'Bir arabanın arkasına saklanırım', isCorrect: false }], category: 'decision' },
  { questionText: 'Hangisi daha sağlıklı bir atıştırmalıktır?', answers: [{ answerText: 'Elma 🍎', isCorrect: true }, { answerText: 'Şeker 🍬', isCorrect: false }, { answerText: 'Cips 🥔', isCorrect: false }], category: 'decision' },
  { questionText: 'Bir kuralı yanlışlıkla çiğnedin. Ne yaparsın?', answers: [{ answerText: 'Özür diler ve nedenini anlatırım', isCorrect: true }, { answerText: 'Kimse görmediyse saklarım', isCorrect: false }, { answerText: 'Başkası yaptı derim', isCorrect: false }], category: 'decision' },
  { questionText: 'Bir sırrı saklamak neden önemlidir?', answers: [{ answerText: 'Çünkü bu arkadaşına güvendiğini gösterir', isCorrect: true }, { answerText: 'Önemli değildir', isCorrect: false }, { answerText: 'Sırlar sıkıcıdır', isCorrect: false }], category: 'decision' },
  { questionText: 'Gökkuşağında hangi renk yoktur? 🌈', answers: [{ answerText: 'Siyah', isCorrect: true }, { answerText: 'Kırmızı', isCorrect: false }, { answerText: 'Mavi', isCorrect: false }], category: 'decision' },
  { questionText: 'Eğer bir süper gücün olsaydı, onu ne için kullanırdın?', answers: [{ answerText: 'İnsanlara yardım etmek için', isCorrect: true }, { answerText: 'Sadece kendim için', isCorrect: false }, { answerText: 'Kötülük yapmak için', isCorrect: false }], category: 'decision' },
  { questionText: 'Zor bir bulmacayla karşılaştın, ne yaparsın?', answers: [{ answerText: 'Sabırla denemeye devam ederim veya yardım isterim', isCorrect: true }, { answerText: 'Hemen pes ederim', isCorrect: false }, { answerText: 'Kızıp oyunu bırakırım', isCorrect: false }], category: 'decision' },
  // Awareness (15 Questions)
  { questionText: 'Yemeğini bitirince annen "ellerine sağlık" derse, nasıl hissedersin?', answers: [{ answerText: 'Mutlu 😊', isCorrect: true }, { answerText: 'Kızgın 😠', isCorrect: false }, { answerText: 'Üzgün 😟', isCorrect: false }], category: 'awareness' },
  { questionText: 'Doğum gününde hediye aldığında ne hissedersin?', answers: [{ answerText: 'Heyecanlı ve mutlu', isCorrect: true }, { answerText: 'Korkmuş', isCorrect: false }, { answerText: 'Sıkılmış', isCorrect: false }], category: 'awareness' },
  { questionText: 'Bu yüz sence ne hissediyor? 😟', answers: [{ answerText: 'Üzgün', isCorrect: true }, { answerText: 'Mutlu', isCorrect: false }, { answerText: 'Kızgın', isCorrect: false }], category: 'awareness' },
  { questionText: 'Korktuğunda vücudunda ne olur?', answers: [{ answerText: 'Kalbim hızlı atar', isCorrect: true }, { answerText: 'Uykum gelir', isCorrect: false }, { answerText: 'Acıkırım', isCorrect: false }], category: 'awareness' },
  { questionText: 'Bir şaka yapıp herkes güldüğünde ne hissedersin?', answers: [{ answerText: 'Gururlu ve neşeli', isCorrect: true }, { answerText: 'Utangaç', isCorrect: false }, { answerText: 'Kızgın', isCorrect: false }], category: 'awareness' },
  { questionText: 'Bu yüz sence ne hissediyor? 😠', answers: [{ answerText: 'Kızgın', isCorrect: true }, { answerText: 'Mutlu', isCorrect: false }, { answerText: 'Şaşkın', isCorrect: false }], category: 'awareness' },
  { questionText: 'Seni en çok ne mutlu eder?', answers: [{ answerText: 'Oyun oynamak', isCorrect: true }, { answerText: 'Cevap kişiye özeldir', isCorrect: true }, { answerText: 'Ailemle vakit geçirmek', isCorrect: true }], category: 'awareness' },
  { questionText: 'Heyecanlandığında nasıl hissedersin?', answers: [{ answerText: 'Karnımda kelebekler uçar gibi', isCorrect: true }, { answerText: 'Yorgun', isCorrect: false }, { answerText: 'Sıkılmış', isCorrect: false }], category: 'awareness' },
  { questionText: 'Bu yüz sence ne hissediyor? 😄', answers: [{ answerText: 'Çok mutlu', isCorrect: true }, { answerText: 'Üzgün', isCorrect: false }, { answerText: 'Korkmuş', isCorrect: false }], category: 'awareness' },
  { questionText: 'Birisi seni dinlemediğinde ne hissedersin?', answers: [{ answerText: 'Değersiz ve üzgün', isCorrect: true }, { answerText: 'Mutlu', isCorrect: false }, { answerText: 'Hiçbir şey', isCorrect: false }], category: 'awareness' },
  { questionText: 'Sabırlı olmak ne demektir?', answers: [{ answerText: 'Sıranı beklemek veya bir şeyin olmasını sakince beklemek', isCorrect: true }, { answerText: 'Çok hızlı koşmak', isCorrect: false }, { answerText: 'Hiçbir şey yapmamak', isCorrect: false }], category: 'awareness' },
  { questionText: 'Bir şeye odaklanmak ne anlama gelir?', answers: [{ answerText: 'Tüm dikkatini o işe vermek', isCorrect: true }, { answerText: 'Gözlerini kapatmak', isCorrect: false }, { answerText: 'Televizyon izlemek', isCorrect: false }], category: 'awareness' },
  { questionText: 'Hayal kırıklığı neye benzer?', answers: [{ answerText: 'İstediğin bir şeyin olmamasına üzülmek', isCorrect: true }, { answerText: 'Çok sevinmek', isCorrect: false }, { answerText: 'Acıkmak', isCorrect: false }], category: 'awareness' },
  { questionText: 'Kendinle gurur duyduğun bir anı düşün. Bu neden oldu?', answers: [{ answerText: 'Zor bir şeyi başardığım için', isCorrect: true }, { answerText: 'Cevap kişiye özeldir', isCorrect: true }, { answerText: 'Yardım ettiğim için', isCorrect: true }], category: 'awareness' },
  { questionText: '"Affetmek" ne anlama gelir?', answers: [{ answerText: 'Birinin yaptığı yanlışa karşı kızgınlığı bırakmak', isCorrect: true }, { answerText: 'Unutmak', isCorrect: false }, { answerText: 'Bağırmak', isCorrect: false }], category: 'awareness' },
  // Visual Questions (10 new questions)
  { questionText: 'Hangisi diğerlerinden farklı?', answers: [{ answerText: '🍎', isCorrect: false }, { answerText: '🍌', isCorrect: false }, { answerText: '🥦', isCorrect: true }, { answerText: '🍓', isCorrect: false }], category: 'logic', type: 'visual' },
  { questionText: 'Bu hayvan nerede yaşar? 🦁', answers: [{ answerText: '🌲', isCorrect: false }, { answerText: '🌊', isCorrect: false }, { answerText: ' savanna', isCorrect: true }], category: 'logic', type: 'visual' },
  { questionText: 'Bu hayvan ne yer? 🐒', answers: [{ answerText: '🍌', isCorrect: true }, { answerText: '🍕', isCorrect: false }, { answerText: '🥕', isCorrect: false }], category: 'logic', type: 'visual' },
  { questionText: 'Hangisi bir taşıt değildir?', answers: [{ answerText: '🚗', isCorrect: false }, { answerText: '🚲', isCorrect: false }, { answerText: '🏠', isCorrect: true }], category: 'decision', type: 'visual' },
  { questionText: 'Yaz mevsimi hangisiyle ilgilidir?', answers: [{ answerText: '☀️', isCorrect: true }, { answerText: '❄️', isCorrect: false }, { answerText: '🍂', isCorrect: false }], category: 'awareness', type: 'visual' },
  { questionText: 'Doğru gölgeyi bul: 🐈', answers: [{ answerText: '🐕', isCorrect: false }, { answerText: '🐈‍⬛', isCorrect: true }, { answerText: '🐅', isCorrect: false }], category: 'logic', type: 'visual' },
  { questionText: 'Bu ikisi bir araya gelince ne olur? 💧+ ❄️ = ?', answers: [{ answerText: '🧊', isCorrect: true }, { answerText: '🔥', isCorrect: false }, { answerText: '💨', isCorrect: false }], category: 'logic', type: 'visual' },
  { questionText: 'Hangisi spor yapmak için kullanılır?', answers: [{ answerText: '📚', isCorrect: false }, { answerText: '⚽', isCorrect: true }, { answerText: '🎮', isCorrect: false }], category: 'decision', type: 'visual' },
  { questionText: 'Mutlu yüz hangisi?', answers: [{ answerText: '😠', isCorrect: false }, { answerText: '😢', isCorrect: false }, { answerText: '😄', isCorrect: true }], category: 'empathy', type: 'visual' },
  { questionText: 'Uyku zamanı geldiğinde hangisi olur?', answers: [{ answerText: '☀️', isCorrect: false }, { answerText: '🌙', isCorrect: true }, { answerText: '⭐', isCorrect: true }], category: 'awareness', type: 'visual' },
];

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const SpeakerOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
const SpeakerOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

const categoryIcons: Record<Category, string> = {
  empathy: '💖',
  logic: '🧠',
  decision: '🧭',
  awareness: '💡'
};

const Mascot = ({ state }: { state: 'idle' | 'happy' | 'thinking' }) => {
  const stateClasses = {
    idle: 'mascot-idle',
    happy: 'mascot-happy',
    thinking: 'mascot-thinking'
  };

  return (
    <div className={`relative w-32 h-32 transition-transform duration-500 ${stateClasses[state]}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full shadow-lg"></div>
      {/* Eyes */}
      <div className={`absolute top-1/3 left-1/4 w-4 h-8 bg-white rounded-full transition-transform duration-300 ${state === 'happy' ? 'h-1 w-6 top-[40%] transform -rotate-12' : ''}`}></div>
      <div className={`absolute top-1/3 right-1/4 w-4 h-8 bg-white rounded-full transition-transform duration-300 ${state === 'happy' ? 'h-1 w-6 top-[40%] transform rotate-12' : ''}`}></div>
      {/* Mouth */}
      <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-white rounded-b-full transition-all duration-300 ${state === 'happy' ? 'h-8 rounded-b-full' : state === 'thinking' ? 'w-4 h-4 rounded-full -translate-y-2' : ''}`}></div>
    </div>
  );
};


const App = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [userName, setUserName] = useState('');
  const [inputName, setInputName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Category, number>>({ empathy: 0, logic: 0, decision: 0, awareness: 0 });
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<Answer[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'thinking'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const comboRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        setUserName(savedName);
        setInputName(savedName);
    }
  }, []);

  useEffect(() => {
    const setVoiceOption = () => {
      const voices = speechSynthesis.getVoices();
      const femaleTurkishVoice = voices.find(v => v.lang === 'tr-TR' && (v.name.includes('Female') || v.name.includes('Yelda') || v.name.includes('Seda') || v.name.includes('Zeynep')));
      setVoice(femaleTurkishVoice || voices.find(v => v.lang === 'tr-TR') || null);
    };
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = setVoiceOption;
      setVoiceOption();
    }
    return () => { if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = null; } };
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }, [isMuted, voice]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuestionTimer(0);
    timerRef.current = window.setInterval(() => {
        setQuestionTimer(prev => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0) {
      setShuffledAnswers(shuffleArray(questions[currentQuestion].answers));
      speak(questions[currentQuestion].questionText);
      setMascotState('idle');
      startTimer();
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, gameState, questions, speak]);
  
  const startGame = () => {
    if (inputName.trim() === '') return;
    setUserName(inputName);
    localStorage.setItem('userName', inputName);

    setQuestions(shuffleArray(allQuestions));
    setCurrentQuestion(0);
    setScores({ empathy: 0, logic: 0, decision: 0, awareness: 0 });
    setScore(0);
    setCombo(0);
    setSelectedAnswer(null);
    setGameState('playing');
    setStartTime(Date.now());
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
      });
    }
  }, []);

  useEffect(() => {
    if (combo > 1) {
      comboRef.current?.classList.add('combo-pop-animation');
      setTimeout(() => {
        comboRef.current?.classList.remove('combo-pop-animation');
      }, 300);
    }
  }, [combo]);

  const handleAnswerClick = (answer: Answer, index: number) => {
    if (selectedAnswer !== null) return;
    
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer({ index, isCorrect: answer.isCorrect });
    if (answer.isCorrect) {
      setMascotState('happy');
      const category = questions[currentQuestion].category;
      const currentCombo = combo + 1;
      setCombo(currentCombo);
      setScore(prev => prev + (10 * currentCombo));
      setScores(prev => ({ ...prev, [category]: prev[category] + 1 }));
    } else {
      setMascotState('thinking');
      setCombo(0);
    }

    setTimeout(() => {
        handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setTotalTime(Date.now() - startTime);
      setGameState('finished');
    }
  };
  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    let result = '';
    if (minutes > 0) result += `${minutes} dakika `;
    if (seconds > 0) result += `${seconds} saniye`;
    return result.trim();
  };

  const getButtonClass = (index: number, isVisual: boolean) => {
    let classes = isVisual ? 'text-4xl py-6' : 'text-lg p-4';
    if (selectedAnswer === null) {
      return `${classes} bg-white hover:bg-blue-100 animate-pulse-gentle`;
    }
    if (selectedAnswer.index === index) {
      return `${classes} ${selectedAnswer.isCorrect ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`;
    }
    return `${classes} bg-gray-200 text-gray-500`;
  }

  const renderContent = () => {
    if (gameState === 'start') {
      return (
        <div className="text-center p-8 flex flex-col items-center max-w-lg w-full">
          <Mascot state="idle" />
          <h1 className="text-5xl font-extrabold text-indigo-800 my-4 drop-shadow-lg">Gelişim Macerası</h1>
          <p className="text-xl text-gray-600 mb-6">Maceraya başlamadan önce adın ne?</p>
          <form onSubmit={(e) => { e.preventDefault(); startGame(); }} className="w-full flex flex-col items-center">
            <input 
              type="text" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Adını buraya yaz..."
              className="w-full max-w-sm text-center text-xl p-4 rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none shadow-md mb-6"
            />
            <button type="submit" disabled={!inputName.trim()} className="px-12 py-5 bg-green-500 text-white font-bold text-2xl rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-400 disabled:scale-100">
              Başla!
            </button>
          </form>
        </div>
      );
    }

    if (gameState === 'finished') {
      const totalQuestionsPerCategory = allQuestions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<Category, number>);

      return (
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-2xl w-full">
          <h2 className="text-4xl font-bold text-indigo-800 mb-2">Harika İş Çıkardın, {userName}!</h2>
          <p className="text-gray-600 mb-4">İşte gelişim raporun:</p>
           <div className="flex justify-center items-center space-x-8 font-semibold text-lg text-gray-700 mb-6">
            <div><StarIcon /> <span className="text-yellow-500">{score}</span> Puan</div>
            <div><ClockIcon /> <span className="text-indigo-600">{formatTime(totalTime)}</span></div>
          </div>
          <div className="space-y-5 text-left">
            {(Object.keys(scores) as Category[]).map(cat => (
              <div key={cat}>
                <h3 className="font-bold text-lg text-gray-700 capitalize flex items-center">
                  <span className="text-2xl mr-2">{categoryIcons[cat]}</span>
                  { {empathy: 'Empati', logic: 'Mantık Yürütme', decision: 'Karar Verme', awareness: 'Duygu Farkındalığı'}[cat] }
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-5 mt-1">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-5 rounded-full" style={{ width: `${(scores[cat] / totalQuestionsPerCategory[cat]) * 100}%` }}></div>
                </div>
                <p className="text-right text-sm text-indigo-600 font-semibold mt-1">{
                  {
                    empathy: "Başkalarının ne hissettiğini anlamakta çok iyisin. ✨",
                    logic: "Mantık ve problem çözmede harikasın! 🚀",
                    decision: "Çok doğru kararlar veriyorsun! 👍",
                    awareness: "Duygularını tanımada çok başarılısın! 😊"
                  }[cat]
                }</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">Unutma, bu sadece eğlenceli bir oyun! Gerçek bir psikolojik değerlendirme değildir.</p>
          <button onClick={startGame} className="mt-8 px-10 py-4 bg-indigo-500 text-white font-bold text-xl rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            Yeniden Oyna
          </button>
        </div>
      );
    }
    
    if (questions.length === 0) return null;
    const question = questions[currentQuestion];
    const isVisualQuestion = question.type === 'visual';

    return (
      <div className="flex flex-col items-center w-full">
        <Mascot state={mascotState} />
        <div className="w-full max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl mt-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4">
                    <div className="text-gray-500 font-bold text-lg bg-white px-3 py-2 rounded-full flex items-center shadow-inner">
                        <StarIcon /> {score}
                    </div>
                    {combo > 1 && <div ref={comboRef} className="text-amber-500 font-bold text-lg">🔥 {combo}x Kombo!</div>}
                </div>
                 <div className="flex items-center space-x-2">
                    <div className="text-gray-500 font-semibold bg-gray-100 px-3 py-2 rounded-full flex items-center">
                        <ClockIcon /> {questionTimer}s
                    </div>
                    <button onClick={() => setIsMuted(prev => !prev)} className="text-gray-500 hover:text-indigo-600 z-10 p-2 rounded-full hover:bg-gray-100">
                      {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
                    </button>
                 </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-indigo-600">Soru {currentQuestion + 1} / {questions.length}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-1 overflow-hidden">
                <div className="bg-gradient-to-r from-green-300 to-blue-400 h-4 rounded-full transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h2 className="relative text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 min-h-[100px] flex items-center justify-center bg-gray-50 p-4 rounded-xl shadow-inner">
                {question.questionText}
            </h2>
            <div className={`space-y-4 ${isVisualQuestion ? 'grid grid-cols-2 gap-4' : ''}`}>
              {shuffledAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer, index)}
                  disabled={selectedAnswer !== null}
                  className={`relative w-full text-center p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out font-medium text-gray-700 ${getButtonClass(index, isVisualQuestion)}`}
                >
                  <span className="z-10 relative">{answer.answerText}</span>
                  {selectedAnswer?.index === index && (
                    <div className={`absolute inset-0 flex items-center justify-end pr-4 feedback-icon`}>
                      <div className={`flex items-center justify-center h-16 w-16 rounded-full ${selectedAnswer.isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                        {selectedAnswer.isCorrect ? <CheckIcon/> : <XIcon/>}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-cyan-200 via-purple-300 to-pink-300 animated-background">
      {renderContent()}
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
