import { Component } from 'react';
import { FallbackUI } from './components/FallbackUi';
import type { Props } from './types/Props';
import type { State } from './types/State';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) {
      return FallbackUI();
    }
    return this.props.children;
  }
}
