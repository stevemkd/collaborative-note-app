import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react'

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
    loading = false
}: ConfirmationModalProps) {
    const iconMap = {
        danger: <AlertTriangle className="w-6 h-6" />,
        warning: <AlertTriangle className="w-6 h-6" />,
        success: <CheckCircle className="w-6 h-6" />,
        info: <AlertTriangle className="w-6 h-6" />
    }

    const iconColor = {
        danger: "text-danger",
        warning: "text-warning",
        success: "text-success",
        info: "text-primary"
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton
            backdrop="blur"
            placement="center"
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
                backdrop: "bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60",
                base: "bg-gradient-to-br from-background via-background to-background/95 border border-default-200/50 shadow-2xl shadow-black/30",
                header: "border-b border-default-200/30 p-8 pb-6",
                body: "p-8 py-6",
                footer: "border-t border-default-200/30 p-8 pt-6 bg-gradient-to-t from-default-50/30 via-transparent to-transparent",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-4">
                            <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl ${iconColor[icon]}/10 border ${iconColor[icon]}/20 mb-2`}>
                                <div className={`absolute inset-0 ${iconColor[icon]}/10 blur-lg rounded-2xl`} />
                                <div className={`relative ${iconColor[icon]} bg-gradient-to-br from-current to-transparent bg-clip-text text-transparent`}>
                                    {iconMap[icon]}
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                                {title}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-default-600 leading-relaxed text-lg font-medium">
                                {description}
                            </p>
                            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-default-100/50 via-transparent to-default-100/50 border border-default-200/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                                    <p className="text-sm text-default-500 font-medium">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="gap-3">
                            <Button
                                color="default"
                                variant="light"
                                onPress={onClose}
                                className="font-semibold h-12 px-6 rounded-xl border border-default-300/50 hover:border-default-400/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                isDisabled={loading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                color={confirmColor}
                                variant="shadow"
                                onPress={() => {
                                    onConfirm()
                                }}
                                isLoading={loading}
                                className="font-semibold h-12 px-6 rounded-xl shadow-lg shadow-danger/20 hover:shadow-danger/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                startContent={!loading && <Trash2 className="w-4 h-4" />}
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