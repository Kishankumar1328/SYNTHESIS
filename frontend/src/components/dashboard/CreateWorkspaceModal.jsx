import { PlusCircle, Loader2 } from 'lucide-react';

const CreateWorkspaceModal = ({ newName, setNewName, onSubmit, onCancel, isSubmitting }) => {
    return (
        <div className="glass-panel p-8 rounded-[2rem] border border-white/10 animate-in slide-in-from-top-4 duration-500 mb-8">
            <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <PlusCircle className="text-muted-foreground w-5 h-5" />
                    </div>
                    <input
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 ring-blue-500/50 outline-none transition-all placeholder:text-muted-foreground/50 text-white"
                        placeholder="Environment Name (e.g. Fraud Detection 2024)"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={!newName.trim() || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Init Workspace'}
                    </button>
                    <button
                        onClick={onCancel}
                        type="button"
                        className="px-6 py-4 text-muted-foreground font-bold hover:text-white transition-colors bg-white/5 rounded-2xl hover:bg-white/10"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateWorkspaceModal;
