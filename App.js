import React from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import axios from 'axios';

const API_KEY = "4520bd98111d19b7";
const DEFAULT_zipcode = 90210;

export default class WeatherApp extends React.Component {

  constructor() {
    super();
    this.state = {
      zipcode: DEFAULT_zipcode,
      days: [],
    }
  }

  _getForecast(zipcode) {
    const request_url = "http://api.wunderground.com/api/" + API_KEY + "/forecast/q/" + zipcode + ".json";
    axios.get(request_url).then((response) => {
      if (response.status == 200) {
        var weather = response.data.forecast.simpleforecast.forecastday;
        var forecast = [];
        weather.forEach((element, index) => {
          forecast = forecast.concat([
            {
              date: element.date.weekday,
              temperature:
              {
                high:
                {
                  fahrenheit: element.high.fahrenheit,
                  celsius: element.high.celsius
                },
                low:
                {
                  fahrenheit: element.low.fahrenheit,
                  celsius: element.low.celsius
                }
              },
              conditions: element.conditions,
              wind:
              {
                mph: element.avewind.mph,
                dir: element.avewind.dir
              },
              average_humidity: element.avehumidity,
              icon_url: element.icon_url
            }
          ]);
        });
        this.setState({ days: forecast });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    if (this.state.days.length <= 0) {
      this._getForecast(this.state.zipcode);
    }

    return (
      <View style={styles.container}>
      <StatusBar hidden/>
        {
          this.state.days.map((element, index) => {
            return (
              <View key={index}
                style={{
                  marginTop: 10,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  width: Dimensions.get('window').width / 1.25
                }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={{ uri: element.icon_url }}
                />
                <Text>{element.conditions}</Text>
                <Text>High: {element.temperature.high.fahrenheit}F | {element.temperature.high.celsius}C</Text>
                <Text>Low: {element.temperature.low.fahrenheit}F | {element.temperature.low.celsius}C</Text>
                <Text>Wind {element.wind.dir} @ {element.wind.mph} MPH</Text>
                <Text>{element.date}</Text>
              </View>
            )
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
  },
});
