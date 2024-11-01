import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
import { DefaultTheme, useTheme } from 'styled-components';

const x = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.7876 17.4248C27.7709 17.4248 31 14.1957 31 10.2124C31 6.22911 27.7709 3 23.7876 3C19.8043 3 16.5752 6.22911 16.5752 10.2124C16.5752 14.1957 19.8043 17.4248 23.7876 17.4248ZM21.3226 5.92165H25.0857L24.7878 12.8609C25.4097 12.8399 26.7195 12.7698 26.9829 12.6568C26.8732 13.0545 26.6537 13.9441 26.6537 14.3209H21.6832C21.6309 12.5102 21.4856 8.29543 21.3226 5.92165Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.4254 11.271H1.87785C1.64503 11.271 1.42174 11.3633 1.25712 11.5277C1.09249 11.6921 1 11.915 1 12.1474V27.047C1 27.5119 1.18497 27.9578 1.51423 28.2865C1.84349 28.6152 2.29006 28.7999 2.7557 28.7999H22.0684C22.534 28.7999 22.9806 28.6152 23.3098 28.2865C23.6391 27.9578 23.8241 27.5119 23.8241 27.047V18.4782C23.438 18.5422 23.0415 18.5754 22.6372 18.5754C22.4458 18.5754 22.2561 18.568 22.0684 18.5533V25.9322L15.625 20.0354L18.5829 17.3289C16.6766 16.0309 15.4248 13.8431 15.4248 11.363C15.4248 11.3323 15.425 11.3016 15.4254 11.271ZM2.7557 25.9304L9.19823 20.0354L2.7557 14.1405V25.9304ZM11.8142 22.4343L10.4975 21.2239L4.1348 27.047H20.6823L14.3179 21.2248L13.0011 22.4343C12.8391 22.5826 12.6274 22.6649 12.4077 22.6649C12.1879 22.6649 11.9762 22.5826 11.8142 22.4343Z" fill="white"/>
</svg>


`;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'fill' | 'stroke'> {
  /**
   * @default "currentColor"
   */
  fill?: keyof DefaultTheme['colors'] | (string & {});
  stroke?: keyof DefaultTheme['colors'] | (string & {});
}
const SvgIcon = (
  { fill: fillProp = 'currentColor', stroke: strokeProp, ...props }: IconProps,
  ref: Ref<SVGSVGElement>
) => {
  const { colors } = useTheme();
  const fill =
    fillProp && fillProp in colors ? colors[fillProp as keyof DefaultTheme['colors']] : fillProp;
  const stroke =
    strokeProp && strokeProp in colors
      ? colors[strokeProp as keyof DefaultTheme['colors']]
      : strokeProp;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={20}
      height={20}
      fill="none"
      stroke="none"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.7876 17.4248C27.7709 17.4248 31 14.1957 31 10.2124C31 6.22911 27.7709 3 23.7876 3C19.8043 3 16.5752 6.22911 16.5752 10.2124C16.5752 14.1957 19.8043 17.4248 23.7876 17.4248ZM21.3226 5.92165H25.0857L24.7878 12.8609C25.4097 12.8399 26.7195 12.7698 26.9829 12.6568C26.8732 13.0545 26.6537 13.9441 26.6537 14.3209H21.6832C21.6309 12.5102 21.4856 8.29543 21.3226 5.92165Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4254 11.271H1.87785C1.64503 11.271 1.42174 11.3633 1.25712 11.5277C1.09249 11.6921 1 11.915 1 12.1474V27.047C1 27.5119 1.18497 27.9578 1.51423 28.2865C1.84349 28.6152 2.29006 28.7999 2.7557 28.7999H22.0684C22.534 28.7999 22.9806 28.6152 23.3098 28.2865C23.6391 27.9578 23.8241 27.5119 23.8241 27.047V18.4782C23.438 18.5422 23.0415 18.5754 22.6372 18.5754C22.4458 18.5754 22.2561 18.568 22.0684 18.5533V25.9322L15.625 20.0354L18.5829 17.3289C16.6766 16.0309 15.4248 13.8431 15.4248 11.363C15.4248 11.3323 15.425 11.3016 15.4254 11.271ZM2.7557 25.9304L9.19823 20.0354L2.7557 14.1405V25.9304ZM11.8142 22.4343L10.4975 21.2239L4.1348 27.047H20.6823L14.3179 21.2248L13.0011 22.4343C12.8391 22.5826 12.6274 22.6649 12.4077 22.6649C12.1879 22.6649 11.9762 22.5826 11.8142 22.4343Z"
        fill={fill}
      />
    </svg>
  );
};
const ForwardRef = forwardRef(SvgIcon);
export default ForwardRef;
