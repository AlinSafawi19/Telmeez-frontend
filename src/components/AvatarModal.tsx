import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Select2 from './Select2';

interface AvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const styles = ['adventurer', 'avataaars', 'bottts', 'croodles', 'micah', 'thumbs'];

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [selectedStyle, setSelectedStyle] = useState(styles[0]);
    const [currentSeed, setCurrentSeed] = useState(`user-${Date.now()}`);

    const regenerateAvatar = () => {
        setCurrentSeed(`user-${Date.now()}-${Math.random()}`);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30" />
                <div className="bg-white rounded-lg p-6 z-10 max-w-md w-full space-y-4 shadow-lg">
                    <Dialog.Title className="text-lg font-semibold">Create Your Avatar</Dialog.Title>

                    <div className="space-y-3">
                        <Select2
                            label="Choose Style:"
                            options={styles.map((style, index) => ({ value: index, label: style }))}
                            value={styles.indexOf(selectedStyle)}
                            onChange={(value) => setSelectedStyle(styles[value])}
                            placeholder="Select avatar style"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <img
                            src={`https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${currentSeed}`}
                            alt="Generated Avatar"
                            className="w-32 h-32"
                        />
                        <button
                            onClick={regenerateAvatar}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none border-none"
                        >
                            Regenerate Avatar
                        </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() =>
                                onSelect(`https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${currentSeed}`)
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Use Avatar
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AvatarModal;