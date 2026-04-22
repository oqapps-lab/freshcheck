import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radii, spacing, typeScale } from '@/constants/tokens';
import { Sprig } from './Glyphs';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.root}>
        <View style={styles.orb}>
          <Sprig size={32} color={colors.primary} />
        </View>
        <Text style={[typeScale.titleL, styles.title]}>something went sideways</Text>
        <Text style={[typeScale.body, styles.body]}>
          the app tripped on itself. tap below to try again — if the same thing
          happens twice, please send us a note from profile → send feedback.
        </Text>
        <Text style={[typeScale.caption, styles.detail]} numberOfLines={3}>
          {this.state.error.message}
        </Text>
        <Pressable
          onPress={this.reset}
          accessibilityRole="button"
          accessibilityLabel="try again"
          style={styles.cta}
        >
          <Text style={[typeScale.titleS, { color: colors.white }]}>try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  orb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  body: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  detail: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 16,
  },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radii.full,
  },
});
