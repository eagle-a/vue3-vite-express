import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BackToTop from './BackToTop.vue'

describe('BackToTop.vue', () => {
  it('should render the component', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.exists()).toBe(true)
  })

  it('should not be visible by default', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.find('.back-to-top').isVisible()).toBe(false)
  })

  it('should become visible when scroll position is greater than visibilityHeight', async () => {
    const wrapper = mount(BackToTop, {
      props: {
        visibilityHeight: 100
      }
    })

    // Simulate scroll event
    window.scrollY = 150
    window.dispatchEvent(new Event('scroll'))

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.back-to-top').isVisible()).toBe(true)
  })

  it('should scroll to top when clicked', async () => {
    const wrapper = mount(BackToTop)

    // Mock window.scrollTo
    const scrollToMock = vi.spyOn(window, 'scrollTo')

    // Simulate scroll position
    window.scrollY = 150
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    // Click the back to top button
    await wrapper.find('.back-to-top').trigger('click')

    // Verify scrollTo was called with correct parameters
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })

    scrollToMock.mockRestore()
  })
})
