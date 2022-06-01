package ro.ubbcluj.cs.tgoian.myapp.todo.item

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import kotlinx.android.synthetic.main.fragment_item_edit.*
import ro.ubbcluj.cs.tgoian.myapp.R
import ro.ubbcluj.cs.tgoian.myapp.core.TAG
import ro.ubbcluj.cs.tgoian.myapp.todo.data.Movie

class ItemEditFragment : Fragment() {
    companion object {
        const val ITEM_ID = "ITEM_ID"
    }

    private lateinit var viewModel: ItemEditViewModel
    private var itemId: String? = null
    private var movie: Movie? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.v(TAG, "onCreate")
        arguments?.let {
            if (it.containsKey(ITEM_ID)) {
                itemId = it.getString(ITEM_ID).toString()
            }
        }

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        Log.v(TAG, "onCreateView")
        return inflater.inflate(R.layout.fragment_item_edit, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        Log.v(TAG, "onActivityCreated")
        setupViewModel()
        fab.setOnClickListener {
            Log.v(TAG, "save item")
            val i = movie
            if (i != null) {
                if (edit_title.text == null){
                    i.title = "none";
                }else{
                    i.title = edit_title.text.toString()
                }
                if (edit_producer.text == null){
                    i.producer = "none";
                }else{
                    i.producer = edit_producer.text.toString();
                }
                if (edit_description.text == null){
                    i.description = "none";
                }else{
                    i.description = edit_description.text.toString();
                }
                viewModel.saveOrUpdateItem(i)
            }
        }

    }

    private fun setupViewModel() {
        viewModel = ViewModelProvider(this).get(ItemEditViewModel::class.java)
        viewModel.fetching.observe(viewLifecycleOwner, { fetching ->
            Log.v(TAG, "update fetching")
            progress.visibility = if (fetching) View.VISIBLE else View.GONE
        })
        viewModel.fetchingError.observe(viewLifecycleOwner, { exception ->
            if (exception != null) {
                Log.v(TAG, "update fetching error")
                val message = "Fetching exception ${exception.message}"
                val parentActivity = activity?.parent
                if (parentActivity != null) {
                    Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show()
                }
            }
        })
        viewModel.completed.observe(viewLifecycleOwner, { completed ->
            if (completed) {
                Log.v(TAG, "completed, navigate back")
                findNavController().popBackStack()
            }
        })
        val id = itemId
        if (id == null) {
            movie = Movie("", "", "", "")
        } else {
            viewModel.getItemById(id).observe(viewLifecycleOwner, {
                Log.v(TAG, "update items")
                if (it != null) {
                    movie = it
                    edit_title.setText(it.title)
                    edit_producer.setText(it.producer)
                    edit_description.setText(it.description)
                }
            })
        }
    }
}
