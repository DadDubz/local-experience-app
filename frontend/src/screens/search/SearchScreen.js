import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    distance: 50,
    activity: "all",
  });

  const categories = [
    { id: 1, name: "Trails", icon: "directions-walk" },
    { id: 2, name: "Fishing", icon: "sailing" },
    { id: 3, name: "Camping", icon: "camping" },
    { id: 4, name: "Parks", icon: "park" },
  ];

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(
          `YOUR_API_URL/search?q=${query}&filters=${JSON.stringify(filters)}`,
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate("LocationDetail", { location: item })}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultType}>{item.type}</Text>
        <Text style={styles.resultDistance}>{item.distance} miles away</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                filters.type === item.name.toLowerCase() &&
                  styles.categoryButtonActive,
              ]}
              onPress={() =>
                setFilters({ ...filters, type: item.name.toLowerCase() })
              }
            >
              <Icon
                name={item.icon}
                size={24}
                color={
                  filters.type === item.name.toLowerCase() ? "#fff" : "#333"
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  filters.type === item.name.toLowerCase() &&
                    styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#3498db" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : (
              <View style={styles.initialState}>
                <Icon name="search" size={48} color="#ccc" />
                <Text style={styles.initialStateText}>
                  Search for trails, fishing spots, and more...
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#3498db",
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  resultDistance: {
    fontSize: 12,
    color: "#999",
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  initialState: {
    alignItems: "center",
    marginTop: 60,
  },
  initialStateText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SearchScreen;