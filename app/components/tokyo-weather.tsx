import { WeatherIcon } from './weather-icon';
import { WeatherTrack } from './weather-track';
import {
  dayOffset,
  getTokyoWeather,
  relativeDayLabel,
  WEATHER_FUTURE_DAYS,
  WEATHER_PAST_DAYS,
  type WeatherDay,
} from '@/app/lib/weather';

/** 「9.7 mm」优先，没有降水就退回当天的降水概率，两者都没有就留空。 */
function precipitationNote(day: WeatherDay): { text: string; wet: boolean } | null {
  if (day.precipitation !== null && day.precipitation >= 0.1) {
    return { text: `${day.precipitation} mm`, wet: true };
  }
  if (day.precipitationChance !== null && day.precipitationChance >= 20) {
    return { text: `${day.precipitationChance}%`, wet: false };
  }
  return null;
}

function WeatherCell({ day, offset }: { day: WeatherDay; offset: number }) {
  const relative = relativeDayLabel(offset);
  const note = precipitationNote(day);
  const state = offset === 0 ? ' is-today' : offset < 0 ? ' is-past' : '';

  return (
    <li className={`home-weather-day${state}`} data-weather-today={offset === 0 ? 'true' : undefined}>
      <p className="home-weather-day-when">
        <span className="home-weather-day-name">{relative ?? day.weekday}</span>
        <span className="home-weather-day-date">{day.monthDay}</span>
      </p>
      <WeatherIcon kind={day.icon} />
      <p className="home-weather-day-label">{day.label}</p>
      <p className="home-weather-day-temp">
        <span className="home-weather-day-high">
          <span className="visually-hidden">最高 </span>
          {day.high}°
        </span>
        <span className="home-weather-day-low">
          <span className="visually-hidden">最低 </span>
          {day.low}°
        </span>
      </p>
      <p className={`home-weather-day-rain${note?.wet ? ' is-wet' : ''}`}>{note ? note.text : ' '}</p>
    </li>
  );
}

/**
 * 首页首屏的东京天气条：过去 7 天 / 今天 / 未来 7 天。
 *
 * 服务端渲染，数据从 Open-Meteo 取（见 app/lib/weather.ts 的缓存与降级）。
 * 取不到就只留一行说明 —— 首屏宁可空一行，也不要把一条读失败的数据
 * 画成看起来正常的天气。
 */
export async function TokyoWeather() {
  const weather = await getTokyoWeather();

  if (!weather) {
    return (
      <section aria-labelledby="home-weather-heading" className="home-weather is-empty">
        <h2 className="home-weather-heading" id="home-weather-heading">
          <span className="home-weather-city">东京天气</span>
          <span className="home-weather-note">暂时读取失败</span>
        </h2>
      </section>
    );
  }

  const cells = weather.days
    .map((day) => ({ day, offset: dayOffset(day.date, weather.today) }))
    .filter(
      (cell): cell is { day: WeatherDay; offset: number } =>
        cell.offset !== null && cell.offset >= -WEATHER_PAST_DAYS && cell.offset <= WEATHER_FUTURE_DAYS,
    );

  if (cells.length === 0) {
    return (
      <section aria-labelledby="home-weather-heading" className="home-weather is-empty">
        <h2 className="home-weather-heading" id="home-weather-heading">
          <span className="home-weather-city">东京天气</span>
          <span className="home-weather-note">暂无可用日期</span>
        </h2>
      </section>
    );
  }

  const now = weather.now;

  return (
    <section aria-labelledby="home-weather-heading" className="home-weather">
      <div className="home-weather-head">
        <h2 className="home-weather-heading" id="home-weather-heading">
          <span className="home-weather-city">东京</span>
          <span className="home-weather-note">
            前 {WEATHER_PAST_DAYS} 天 · 后 {WEATHER_FUTURE_DAYS} 天
          </span>
        </h2>

        {now ? (
          <p className="home-weather-now">
            <WeatherIcon className="home-weather-now-icon" kind={now.icon} />
            <span className="home-weather-now-temp">{now.temperature}°</span>
            <span className="home-weather-now-label">{now.label}</span>
            {now.humidity !== null ? <span className="home-weather-now-meta">湿度 {now.humidity}%</span> : null}
            <span className="home-weather-now-meta" lang="en">
              {now.observedAt} JST
            </span>
          </p>
        ) : null}

        {weather.stale ? <p className="home-weather-stale">未能刷新，显示上一次取到的数据</p> : null}
      </div>

      <WeatherTrack label={`东京前 ${WEATHER_PAST_DAYS} 天到后 ${WEATHER_FUTURE_DAYS} 天的天气`}>
        {cells.map(({ day, offset }) => (
          <WeatherCell day={day} key={day.date} offset={offset} />
        ))}
      </WeatherTrack>
    </section>
  );
}
