import { Colors } from '@blueprintjs/colors';

export const balanceColor = (n: number) =>
  n > 0 ? Colors.GREEN3 : n < 0 ? Colors.RED3 : undefined;
