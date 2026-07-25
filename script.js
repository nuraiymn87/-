const openBtn = document.getElementById("openBtn");
const music = document.getElementById("music");

const cover = document.getElementById("cover");
const main = document.getElementById("main");

// стартовое состояние
main.style.display = "none";

// функция открытия приглашения
openBtn.addEventListener("click", async () => {

    // показать основной блок
    cover.style.transition = "1.2s ease";
    cover.style.opacity = "0";

    setTimeout(() => {
        cover.style.display = "none";
        main.style.display = "block";

        // плавное появление main
        main.style.opacity = "0";
        main.style.transform = "translateY(30px)";

        setTimeout(() => {
            main.style.transition = "1.2s ease";
            main.style.opacity = "1";
            main.style.transform = "translateY(0)";
        }, 100);

    }, 1000);

    // музыка (важно для телефонов)
    try {
        music.currentTime = 0;
        await music.play();
    } catch (e) {
        console.log("Музыка не запустилась автоматически:", e);
    }
});

// 1. Инициализация Supabase
const SUPABASE_URL = 'https://wbmdqcqtdlotwcedbgdw.supabase.co';
const SUPABASE_KEY = 'ВАШ_PUBLISHABLE_KEY_СКОПИРОВАННЫЙ_ИЗ_SUPABASE'; // Замените на ваш ключ sb_publishable_...

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Открытие и закрытие модального окна
function openWishModal() {
  document.getElementById('wishModal').classList.add('active'); // или style.display = 'flex' в зависимости от ваших стилей
}

function closeWishModal() {
  document.getElementById('wishModal').classList.remove('active');
  document.getElementById('wishName').value = '';
  document.getElementById('wishText').value = '';
}

// 3. Загрузка пожеланий из базы данных
async function loadWishes() {
  const wishTrack = document.getElementById('wishTrack');
  
  const { data: wishes, error } = await supabaseClient
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка загрузки:', error);
    wishTrack.innerHTML = '<p style="text-align:center;">Каалоолорду жүктөөдө ката чыкты.</p>';
    return;
  }

  if (!wishes || wishes.length === 0) {
    wishTrack.innerHTML = '<p style="text-align:center;">Азырынча каалоолор жок. Биринчи болуп жазыңыз!</p>';
    return;
  }

  // Создаем карточки пожеланий для слайдера
  wishTrack.innerHTML = wishes.map(w => `
    <div class="wish-card" style="padding: 15px; margin: 10px; border: 1px solid #c4a882; border-radius: 8px;">
      <h4 style="margin-bottom: 5px; color: var(--text-dark);">${escapeHtml(w.name)}</h4>
      <p style="color: var(--text-light); font-size: 14px;">${escapeHtml(w.text)}</p>
    </div>
  `).join('');
}

// 4. Отправка нового пожелания в базу
async function addWish() {
  const nameInput = document.getElementById('wishName');
  const textInput = document.getElementById('wishText');

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    alert('Сураныч, атыңызды жана каалооңузду жазыңыз!');
    return;
  }

  // Отправляем в Supabase
  const { error } = await supabaseClient
    .from('wishes')
    .insert([{ name: name, text: text }]);

  if (error) {
    alert('Каалоо жөнөтүүдө ката чыкты. Кайра текшерип көрүңүз.');
    console.error(error);
  } else {
    closeWishModal();
    loadWishes(); // Заново загружаем список, чтобы сразу появилось новое пожелание
  }
}

// Защита от ввода вредоносных символов
function escapeHtml(text) {
  return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

// Загружаем пожелания при старте страницы
document.addEventListener('DOMContentLoaded', () => {
  loadWishes();
});
// дополнительный эффект: мягкий скролл (если появятся секции)
document.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".fade");
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (position < screenHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
});
