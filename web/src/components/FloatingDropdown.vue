<template>
  <div class="floating-dropdown-wrapper" ref="triggerRef">
    <!-- 触发按钮插槽 -->
    <slot name="trigger" :toggle="toggleDropdown" :isOpen="showDropdown">
      <button 
        class="dropdown-trigger"
        @click="toggleDropdown"
        :class="{ active: showDropdown }"
      >
        <slot name="trigger-content"></slot>
      </button>
    </slot>
    
    <!-- 浮动弹框 -->
    <Teleport to="body">
      <div 
        v-if="showDropdown" 
        class="floating-dropdown"
        :style="dropdownStyle"
        :class="dropdownClass"
        @click.stop
      >
        <slot name="dropdown" :close="closeDropdown"></slot>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

export default {
  name: 'FloatingDropdown',
  props: {
    // 弹框宽度
    width: {
      type: [String, Number],
      default: 320
    },
    // 最大高度
    maxHeight: {
      type: [String, Number],
      default: 400
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 自定义类名
    dropdownClass: {
      type: String,
      default: ''
    },
    // 偏移量
    offset: {
      type: Number,
      default: 8
    },
    // 是否显示（支持 v-model）
    modelValue: {
      type: Boolean,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'open', 'close'],
  setup(props, { emit }) {
    const showDropdown = ref(false)
    const triggerRef = ref(null)
    const dropdownStyle = ref({})

    // 如果使用 v-model，同步状态
    watch(() => props.modelValue, (val) => {
      if (val !== undefined) {
        showDropdown.value = val
      }
    })

    watch(showDropdown, (val) => {
      if (props.modelValue !== undefined) {
        emit('update:modelValue', val)
      }
      emit(val ? 'open' : 'close')
    })

    const toggleDropdown = async () => {
      if (props.disabled) return
      
      showDropdown.value = !showDropdown.value
      
      if (showDropdown.value) {
        await nextTick()
        calculatePosition()
      }
    }

    const closeDropdown = () => {
      showDropdown.value = false
    }

    const calculatePosition = () => {
      if (!triggerRef.value) return
      
      const rect = triggerRef.value.getBoundingClientRect()
      const dropdownHeight = typeof props.maxHeight === 'number' 
        ? props.maxHeight 
        : parseInt(props.maxHeight)
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      
      // 判断是向上还是向下显示
      const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
      
      const width = typeof props.width === 'number' 
        ? `${props.width}px` 
        : props.width
      
      if (showAbove) {
        dropdownStyle.value = {
          position: 'fixed',
          left: `${rect.left}px`,
          bottom: `${window.innerHeight - rect.top + props.offset}px`,
          width: width,
          minWidth: `${Math.max(rect.width, 200)}px`,
          maxWidth: '90vw'
        }
      } else {
        dropdownStyle.value = {
          position: 'fixed',
          left: `${rect.left}px`,
          top: `${rect.bottom + props.offset}px`,
          width: width,
          minWidth: `${Math.max(rect.width, 200)}px`,
          maxWidth: '90vw'
        }
      }
    }

    const handleClickOutside = (event) => {
      if (showDropdown.value && 
          triggerRef.value && 
          !triggerRef.value.contains(event.target)) {
        closeDropdown()
      }
    }

    const handleResize = () => {
      if (showDropdown.value) {
        calculatePosition()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, true)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    })

    return {
      showDropdown,
      triggerRef,
      dropdownStyle,
      toggleDropdown,
      closeDropdown
    }
  }
}
</script>

<style scoped>
.floating-dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.1);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 8px;
  color: #4a6cf7;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dropdown-trigger:hover {
  background: rgba(74, 108, 247, 0.2);
}

.dropdown-trigger.active {
  background: rgba(74, 108, 247, 0.3);
  color: #3a5ce4;
}

.floating-dropdown {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 108, 247, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
