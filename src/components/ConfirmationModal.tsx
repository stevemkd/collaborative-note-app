import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    confirmColor?: 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'default'
    icon?: 'danger' | 'warning' | 'success' | 'info'
    loading?: boolean
    isDestructive?: boolean
    warningMessage?: string
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'danger',
    icon = 'danger',
    loading = false,
    isDestructive = true,
    warningMessage = 'This action cannot be undone'
}: ConfirmationModalProps) {
    const iconMap = {
        danger: <AlertTriangle className="w-6 h-6" />,
        warning: <AlertTriangle className="w-6 h-6" />,
        success: <CheckCircle className="w-6 h-6" />,
        info: <Info className="w-6 h-6" />
    }

    const iconColor = {
        danger: "text-danger",
        warning: "text-warning",
        success: "text-success",
        info: "text-primary"
    }

    const buttonIcons = {
        danger: <Trash2 className="w-4 h-4" />,
        warning: <AlertTriangle className="w-4 h-4" />,
        success: <CheckCircle className="w-4 h-4" />,
        info: <Info className="w-4 h-4" />,
        primary: null,
        secondary: null,
        default: null
    }

    const buttonShadow = {
        danger: "shadow-lg shadow-danger/20 hover:shadow-danger/30",
        warning: "shadow-lg shadow-warning/20 hover:shadow-warning/30",
        success: "shadow-lg shadow-success/20 hover:shadow-success/30",
        primary: "shadow-lg shadow-primary/20 hover:shadow-primary/30",
        secondary: "shadow-lg shadow-secondary/20 hover:shadow-secondary/30",
        default: "shadow-lg shadow-default/20 hover:shadow-default/30"
    }

    const warningColors = {
        danger: "bg-danger/10 text-danger border-danger/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        success: "bg-success/10 text-success border-success/20",
        info: "bg-primary/10 text-primary border-primary/20"
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton
            backdrop="blur"
            placement="center"
            size="md" // Added size prop to control modal width
            motionProps={{
                variants: {
                    enter: {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        },
                    },
                    exit: {
                        scale: 0.95,
                        opacity: 0,
                        y: 20,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
            classNames={{
                wrapper: "p-4", // Added wrapper padding for mobile
                backdrop: "bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60",
                base: "bg-gradient-to-br from-background via-background to-background/95 border border-default-200/50 shadow-2xl shadow-black/30 max-w-md mx-4", // Added max-width and margin
                header: "border-b border-default-200/30 p-6 pb-4",
                body: "p-6 py-4",
                footer: "border-t border-default-200/30 p-6 pt-4 bg-gradient-to-t from-default-50/30 via-transparent to-transparent",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-4">
                            <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl ${iconColor[icon]}/10 border ${iconColor[icon]}/20 mb-2`}>
                                <div className={`absolute inset-0 ${iconColor[icon]}/10 blur-lg rounded-2xl`} />
                                <div className={`relative ${iconColor[icon]}`}>
                                    {iconMap[icon]}
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                                {title}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-default-600 leading-relaxed text-base font-medium">
                                {description}
                            </p>
                            {isDestructive && (
                                <div className={`mt-4 p-4 rounded-xl border ${warningColors[icon]}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${iconColor[icon]} animate-pulse`} />
                                        <p className="text-sm font-medium">
                                            {warningMessage}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter className="gap-3">
                            <Button
                                color="default"
                                variant="light"
                                onPress={onClose}
                                className="font-semibold h-12 px-6 rounded-xl border border-default-300/50 hover:border-default-400/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex-1"
                                isDisabled={loading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                color={confirmColor}
                                variant="shadow"
                                onPress={onConfirm}
                                isLoading={loading}
                                className={`font-semibold h-12 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex-1 ${buttonShadow[confirmColor]}`}
                                startContent={!loading && buttonIcons[confirmColor]}
                            >
                                {confirmText}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
