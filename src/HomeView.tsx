// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, StatusBar, StyleSheet, Dimensions, useColorScheme, Image, Button, Modal, TouchableOpacity, Text, FlatList } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import ApiViewModel from './ApiViewModel'; // Import the ViewModel
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as appInsights from 'appinsights-module';
import { notifyMessage } from './Utils';
import cardData from './product.json';

const apiViewModel = new ApiViewModel();

const HomeView = ({ selectedMd, selectedRegion }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { width } = Dimensions.get('window');
    const [carouselData, setCarouselData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isBannerVisible, setBannerVisible] = useState(true); // Set to true initially

    useEffect(() => {
        fetchDataForSlider();
        fetchDataForModalBanner();
        appInsights.trackPageView('Home View');
    }, []);

    const fetchDataForSlider = async () => {
        const { success, data, error } = await apiViewModel.fetchBannerData(selectedMd, selectedRegion);
        if (success) {
            if (Array.isArray(data)) {
                setCarouselData(data);
            } else {
                console.error('Data fetched for slider is not an array:', data);
            }
        } else {
            console.error('Error fetching data for slider:', error);
        }
    };

    const fetchDataForModalBanner = async () => {
        const { success, data, error } = await apiViewModel.fetchCampaignDetail(selectedMd, selectedRegion);
        if (success && data.length > 0) {
            const latestCampaign = data[data.length - 1]; // Get the last item in the array (assumes the latest campaign is at the end)
            setModalData(latestCampaign); // Set the modal data to the latest campaign
        } else {
            console.error('Error fetching data for modal banner:', error);
        }
    };        

    const backgroundStyle = {
        backgroundColor: isDarkMode ? 'black' : 'white',
    };

    const handleSliderItemClick = (item) => {
        appInsights.trackSliderDetail(
            item.campaign_title,
            item.campaign_type,
            item.campaign_md_id,
            item.image_campaign,
            item.campaign_url,
            item.campaign_referrence
        );

        notifyMessage('Slider item clicked tracked');
    };

    const handleBannerItemClick = () => {
        appInsights.trackBannerDetail(
            modalData.campaign_title,
            modalData.campaign_type,
            modalData.campaign_md_id,
            modalData.image_campaign,
            modalData.campaign_url,
            modalData.campaign_referrence
        );

        notifyMessage('Banner item clicked tracked');
    }

    const handleBannerClose = () => {

        setBannerVisible(false);

        notifyMessage('Banner item closed tracked');
        

        appInsights.trackBannerClose(
            modalData.campaign_title,
            modalData.campaign_type,
            modalData.campaign_md_id,
            modalData.image_campaign,
            modalData.campaign_url,
            modalData.campaign_referrence
        );
    }

    const renderCarouselItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSliderItemClick(item)}>
          <View style={styles.carouselContainer}>
            <Image
              source={{ uri: item.image_campaign }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      );

    
      
    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>

                <View>
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        }}>

                        <View style={styles.carouselWrapper}>
                            <Carousel
                                data={carouselData}
                                renderItem={renderCarouselItem}
                                sliderWidth={width * 1}
                                itemWidth={width * 0.8}
                            />
                        </View>

                        <View style={styles.container}>
                            <FlatList
                                data={cardData}
                                numColumns={2}
                                renderItem={({ item }) => <CardComponent product={item} />}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContainer}
                                columnWrapperStyle={styles.columnWrapper}
                            />
                        </View>

                        <Modal
                            visible={isBannerVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setBannerVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.bannerContainer}>
                                    <Image
                                        source={{ uri: modalData.image_campaign }}
                                        style={styles.bannerImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.buttonContainer}>
                                        <Button title="Close" onPress={() => handleBannerClose() } />
                                        <Button title="Learn more" onPress={() => handleBannerItemClick()} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2; // Adjust the card width according to your layout


const CardComponent = ({ product }) => {
    // Extract data from the product object
    const { title, thumbnail, prices } = product;
  
    return (
      <TouchableOpacity style={styles.cardContainer}>
        <Image source={{ uri: thumbnail }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardPrice}>{prices.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bannerContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: 200,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
    },
    carouselWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 24,
    },
    carouselImage: {
        width: '100%',
        height: 200,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    listContainer: {
        paddingHorizontal: 16 / 2,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16 / 2,
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cardImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      cardContent: {
        padding: 20,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      cardDescription: {
        fontSize: 16,
      },
});

export default HomeView;
