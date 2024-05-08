import * as appInsights from 'appinsights-module';

class ApiViewModel {
  apiEndpoint = 'https://apidev-ads.modakita.com/api/v1';
  apiKeyMpm = 'YWhkDvaspKrsT8AvOiRQ';
  apiKeyWahana = 'il50odsG7RduOrAcRtte';
  apiKeyAstra = 'lzVyjgdlWEN8Ulc8Lqm7';
  apiKeyDaya = '0GsR6sLW3NtTI0CXmnTN';

  async login(username, password, md, regionId) {
    try {
      const apiKeys = [this.apiKeyWahana, this.apiKeyAstra, this.apiKeyMpm, this.apiKeyDaya];
  
      const apiKeyIndex = md - 1;
  
      if (apiKeyIndex < 0 || apiKeyIndex >= apiKeys.length) {
        console.error('Invalid MD', regionId);
        return { success: false, error: 'Invalid MD' };
      }

      console.log(apiKeys[apiKeyIndex])

      const response = await fetch(`${this.apiEndpoint}/sdk/mobile/users/${username}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKeys[apiKeyIndex],
        },
      });

      if (response.ok) {
        const userData = await response.json();

        const {
          fullname,
          email,
          phoneNumber,
          province,
          city,
          village,
          subDistrict,
          gender,
          address,
          education,
          religion,
          hobby,
          occupation,
          occupationCity,
          expenditure,
          referalCode,
          point
        } = userData.data;

        appInsights.trackUserProfile(
          fullname,
          email,
          phoneNumber,
          province,
          city,
          village,
          subDistrict,
          gender,
          address,
          education,
          religion,
          hobby,
          occupation,
          occupationCity,
          expenditure,
          referalCode,
          point
        );

        return { success: true };
      } else {
        try {
          const errorText = await response.text();
          console.error('Failed to login. Server response:', errorText);
          return { success: false, error: 'An error occurred during login.' };
        } catch (textError) {
          console.error('Failed to read error response as text:', textError);
          return { success: false, error: 'An error occurred during login.' };
        }
      }      
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login.' };
    }
  }

  async fetchBannerData(md, regionId) {
    try {
      const formattedDate = new Date().toISOString();
      const epochTime = Date.parse(formattedDate) / 1000;

      const apiKeys = [this.apiKeyWahana, this.apiKeyAstra, this.apiKeyMpm, this.apiKeyDaya];
  
      const apiKeyIndex = md - 1;
  
      if (apiKeyIndex < 0 || apiKeyIndex >= apiKeys.length) {
        console.error('Invalid MD', regionId);
        return { success: false, error: 'Invalid MD' };
      }

      console.log(apiKeys[apiKeyIndex])
      
      const response = await fetch(`${this.apiEndpoint}/sdk/mobile/banner?time=${epochTime}&regional_id=${regionId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKeys[apiKeyIndex],
        },
      });
      

      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData.data };
      } else {
        console.error('Banner Failed to fetch data from API:', response.statusText);
        return { success: false, error: response.statusText || 'Failed to fetch data from API' };
      }
    } catch (error) {
      console.error('Banner Error during API call:', error);
      return { success: false, error: 'Banner Error during API call' };
    }
  }

  async fetchCampaignDetail(md, regionId) {
    try {
      const formattedDate = new Date().toISOString();
      const epochTime = Date.parse(formattedDate) / 1000;

      const apiKeys = [this.apiKeyWahana, this.apiKeyAstra, this.apiKeyMpm, this.apiKeyDaya];
  
      const apiKeyIndex = md - 1;
  
      if (apiKeyIndex < 0 || apiKeyIndex >= apiKeys.length) {
        console.error('Invalid MD', regionId);
        return { success: false, error: 'Invalid MD' };
      }

      console.log(apiKeys[apiKeyIndex])
      
      const response = await fetch(`${this.apiEndpoint}/sdk/mobile/popup?time=${epochTime}&regional_id=${regionId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKeys[apiKeyIndex],
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData.data };
      } else {
        console.error('Popup Failed to fetch data from API:', response.statusText);
        return { success: false, error: response.statusText || 'Failed to fetch data from API' };
      }
    } catch (error) {
      console.error('Popup Error during API call:', error);
      return { success: false, error: 'Popup Error during API call' };
    }
  }

  async fetchRegionById(regionId) {
    try {
      const apiKeys = [this.apiKeyWahana, this.apiKeyAstra, this.apiKeyMpm, this.apiKeyDaya];
  
      const apiKeyIndex = regionId - 1;
  
      if (apiKeyIndex < 0 || apiKeyIndex >= apiKeys.length) {
        console.error('Invalid region ID:', regionId);
        return { success: false, error: 'Invalid region ID' };
      }

      console.log(apiKeys[apiKeyIndex])
  
      const response = await fetch(`${this.apiEndpoint}/sdk/mobile/region`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKeys[apiKeyIndex], 
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData.data };
      } else {
        console.error(response.headers);
        console.error('Region Failed to fetch data from API:', response.statusText);
        return { success: false, error: response.statusText || 'Failed to fetch data from API' };
      }
    } catch (error) {
      console.error('Region Error during API call:', error);
      return { success: false, error: 'Region Error during API call' };
    }
  }
  
}

export default ApiViewModel;
