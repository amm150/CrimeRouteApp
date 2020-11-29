import React, {
    useEffect,
    useState
} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PageHeader from '../../components/headers/PageHeader';
import Listing from '../../components/listings/Listing';
import ImageAndDescription from '../../components/listings/items/ImageAndDescription';
import ImageAndDescriptionLoadingState from '../../components/listings/items/loading-states/ImageAndDescriptionLoadingState';

/**
 * @description NewsContainer
 * 
 * @returns {React.ReactNode}
 */
function NewsContainer(props) {
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        if(initializing) {
            setInitializing(false);
        }
    }, [initializing]);

    function buildListingItems() {
        // TODO: Pull this from an api instead

        return [
            {
                description: 'This is the description',
                id: 1,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            },
            {
                description: 'This is the description',
                id: 2,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            },
            {
                description: 'This is the description',
                id: 3,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            },
            {
                description: 'This is the description',
                id: 4,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            },
            {
                description: 'This is the description',
                id: 5,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            },
            {
                description: 'This is the description',
                id: 6,
                image: 'https://via.placeholder.com/150',
                title: 'This is the title'
            }
        ]
    };

    const headerData = {
            label: props.translations['news']
        },
        listingData = {
            items: buildListingItems(),
            listingItem: ImageAndDescription,
            listingItemLoadingState: ImageAndDescriptionLoadingState,
            loading: initializing,
            loadingStateItemCount: 6
        };

    return (
        <View>
            <PageHeader {...headerData}/>
            <ScrollView style={styles.contents} >
                <Listing {...listingData}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
	contents: {
        height: '100%',
        width: '100%'
    }
});

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(NewsContainer);