import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COFFEE_TYPES = [
  { id: 'espresso', label: 'Espresso' },
  { id: 'latte', label: 'Latte' },
  { id: 'cappuccino', label: 'Cappuccino' },
  { id: 'americano', label: 'Americano' },
];

const FONT_FAMILY = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function App() {
  const [orders, setOrders] = useState([]);
  const listRef = useRef(null);

  const addOrder = (type) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const nextOrders = [
      ...orders,
      {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        timestamp,
      },
    ];

    setOrders(nextOrders);
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    });
  };

  const clearOrders = () => setOrders([]);

  const headerSubtitle = useMemo(() => {
    if (orders.length === 0) {
      return 'Tap a coffee card to start your order queue.';
    }
    return `${orders.length} order${orders.length === 1 ? '' : 's'} queued for pickup.`;
  }, [orders.length]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>Daily Brew</Text>
            <Text style={styles.title}>Coffee Order Tracker</Text>
            <Text style={styles.subtitle}>{headerSubtitle}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all orders"
            style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
            onPress={clearOrders}
          >
            <Ionicons name="trash-outline" size={22} color="#4a2c2a" />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {COFFEE_TYPES.map((coffee) => (
            <Pressable
              key={coffee.id}
              accessibilityRole="button"
              accessibilityLabel={`Add ${coffee.label} order`}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => addOrder(coffee.label)}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="cafe" size={24} color="#f4e4c1" />
              </View>
              <Text style={styles.cardTitle}>{coffee.label}</Text>
              <Text style={styles.cardCaption}>Add to order list</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          <FlatList
            ref={listRef}
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={orders.length === 0 ? styles.emptyContent : styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.orderRow}>
                <View style={styles.orderIcon}>
                  <Ionicons name="cafe" size={18} color="#6b4423" />
                </View>
                <Text style={styles.orderText}>{`${item.type} • ${item.timestamp}`}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="cafe-outline" size={34} color="#6b4423" />
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptySubtitle}>Your latest coffee picks will appear here.</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f1e8',
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: '#f1e9dc',
    backgroundImage: 'linear-gradient(180deg, #f5f1e8 0%, #e8dcc8 100%)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#6b4423',
    marginBottom: 6,
    fontWeight: '700',
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    lineHeight: 34,
    color: '#2d1b1a',
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 22,
    color: '#4a2c2a',
  },
  clearButton: {
    minWidth: 48,
    minHeight: 48,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f4e4c1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.15)',
    shadowColor: '#4a2c2a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  card: {
    width: '48.5%',
    minHeight: 132,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#4a2c2a',
    justifyContent: 'space-between',
    shadowColor: '#2d1b1a',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6b4423',
    marginBottom: 18,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: '#fef8ee',
    fontWeight: '700',
    marginBottom: 6,
  },
  cardCaption: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    color: '#f4e4c1',
    opacity: 0.95,
  },
  listSection: {
    flex: 1,
    backgroundColor: 'rgba(255, 249, 239, 0.72)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(107, 68, 35, 0.08)',
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: '#2d1b1a',
    fontWeight: '700',
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: '#4a2c2a',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    color: '#6b4423',
    textAlign: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fffaf2',
    marginBottom: 10,
  },
  orderIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4e4c1',
    marginRight: 12,
  },
  orderText: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    color: '#2d1b1a',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
