import Telegraf from "telegraf";
const { Markup, session, Stage } = Telegraf;
import WizardScene from "telegraf/scenes/wizard/index.js";
import { getLattitude, getWeather } from "./utils/weather.js";
import getDirection from "./utils/direction.js";

const bot = new Telegraf(process.env.BOT_KEY);

bot.start((ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}, Welcome`,
    Markup.inlineKeyboard([
      Markup.callbackButton("Check Weather", "weatheR"),
    ]).extra()
  );
});

const weather = new WizardScene(
  "weat_her",
  (ctx) => {
    ctx.reply(`Please Send A Locatoin`);
    return ctx.wizard.next();
  },
  (ctx) => {
    let Address;
    if (ctx.message == undefined) {
      ctx.reply(
        `Please send the location first`,
        Markup.inlineKeyboard([
          Markup.callbackButton(`Try Again`, `weatheR`),
        ]).extra()
      );
    } else {
      Address = ctx.message.text;
      getLattitude(Address)
        .then((data) => {
          const lattitude = data.data.features[0].center[1];
          const longitude = data.data.features[0].center[0];
          const location = data.data.features[0].place_name;
          getWeather(lattitude, longitude)
            .then((res) => {
              if (res.data.cod !== 200) {
                ctx.reply(
                  `No such place found`,
                  Markup.inlineKeyboard([
                    Markup.callbackButton(`Try Again`, `weatheR`),
                  ]).extra()
                );
              }
              const { cod, name, visibility, timezone } = res.data;
              const { main, description } = res.data.weather[0];
              const {
                temp,
                feels_like,
                temp_min,
                temp_max,
                pressure,
                humidity,
              } = res.data.main;
              const { speed, deg } = res.data.wind;
              const { all } = res.data.clouds;

              ctx.reply(
                `Currently in ${location}, The weather is as follows : \nDescription : ${description} \nTemperature : ${temp}°C \nFeels like : ${feels_like}°C \nVisibility : ${visibility} meter \nHumidity : ${humidity}% \nWind : ${speed}km/h ${getDirection(
                  deg
                )}`,
                Markup.inlineKeyboard([
                  Markup.callbackButton(`Check Again`, `weatheR`),
                ]).extra()
              );
            })
            .catch((err) => {
              ctx.reply(
                err.message,
                Markup.inlineKeyboard([
                  Markup.callbackButton(`Try Again`, `weatheR`),
                ]).extra()
              );
            });
        })
        .catch((err) => {
          ctx.reply(
            `Can\'t find that place`,
            Markup.inlineKeyboard([
              Markup.callbackButton(`Try Again`, `weatheR`),
            ]).extra()
          );
        });
    }

    return ctx.scene.leave();
  }
);

const stage = new Stage([weather], { default: "weat_her" });
bot.use(session());
bot.use(stage.middleware());
bot.launch();
